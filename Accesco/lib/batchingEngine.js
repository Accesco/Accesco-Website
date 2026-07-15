/**
 * @fileoverview Order batching engine for Quick Commerce deliveries.
 *
 * Groups eligible orders into batches that share vendor, vertical, delivery
 * type, and time window. Each batch is sized between 5–6 orders and assigned
 * one rider.
 *
 * Data structures: HashMap (grouping), Queue (FIFO pending), Priority Queue
 * (ready batches by urgency).
 *
 * No Firestore. No UI. No React.
 *
 * @module lib/batchingEngine
 */

/** @type {number} */
export const MIN_BATCH_SIZE = 5;

/** @type {number} */
export const MAX_BATCH_SIZE = 6;

/**
 * @typedef {object} BatchableOrder
 * @property {string} id
 * @property {string} vendorId
 * @property {string} vertical - e.g. grocery | food | fashion
 * @property {string} deliveryType - e.g. instant | scheduled
 * @property {number|string} timeWindow - bucket key (epoch bucket or slot id)
 * @property {number} [priority] - lower = more urgent (default 0)
 * @property {number} [createdAt] - ms epoch
 */

/**
 * @typedef {object} Batch
 * @property {string} id
 * @property {string} vendorId
 * @property {string} vertical
 * @property {string} deliveryType
 * @property {string|number} timeWindow
 * @property {string[]} orderIds
 * @property {BatchableOrder[]} orders
 * @property {string|null} riderId
 * @property {number} size
 * @property {number} createdAt
 * @property {'forming'|'ready'|'assigned'} status
 */

/**
 * Builds a composite HashMap key for batch eligibility.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {Pick<BatchableOrder, 'vendorId'|'vertical'|'deliveryType'|'timeWindow'>} order
 * @returns {string|null}
 */
export function buildBatchKey(order) {
  if (!order) return null;
  const { vendorId, vertical, deliveryType, timeWindow } = order;
  if (
    vendorId == null ||
    vendorId === '' ||
    vertical == null ||
    vertical === '' ||
    deliveryType == null ||
    deliveryType === '' ||
    timeWindow == null ||
    timeWindow === ''
  ) {
    return null;
  }
  return `${vendorId}::${vertical}::${deliveryType}::${timeWindow}`;
}

/**
 * Returns true when an order has all fields required for batching.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {BatchableOrder} order
 * @returns {boolean}
 */
export function isBatchEligible(order) {
  return buildBatchKey(order) !== null && Boolean(order?.id);
}

/**
 * Simple FIFO queue.
 * Time: enqueue/dequeue O(1) amortized. Space: O(n).
 */
export class Queue {
  constructor() {
    /** @type {any[]} */
    this._items = [];
    this._head = 0;
  }

  /** @param {any} item */
  enqueue(item) {
    this._items.push(item);
  }

  /** @returns {any|undefined} */
  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this._items[this._head];
    this._head += 1;
    // Periodically compact to avoid unbounded growth.
    if (this._head > 32 && this._head * 2 > this._items.length) {
      this._items = this._items.slice(this._head);
      this._head = 0;
    }
    return item;
  }

  /** @returns {boolean} */
  isEmpty() {
    return this._head >= this._items.length;
  }

  /** @returns {number} */
  get size() {
    return Math.max(0, this._items.length - this._head);
  }

  /** @returns {any[]} */
  toArray() {
    return this._items.slice(this._head);
  }
}

/**
 * Binary min-heap priority queue.
 * Lower priority number = higher urgency.
 * Time: insert/extract O(log n). Space: O(n).
 */
export class PriorityQueue {
  constructor() {
    /** @type {Array<{ priority: number, value: any }>} */
    this._heap = [];
  }

  /**
   * @param {any} value
   * @param {number} [priority=0]
   */
  insert(value, priority = 0) {
    this._heap.push({ priority: Number(priority) || 0, value });
    this._bubbleUp(this._heap.length - 1);
  }

  /** @returns {any|undefined} */
  extractMin() {
    if (this._heap.length === 0) return undefined;
    const min = this._heap[0].value;
    const last = this._heap.pop();
    if (this._heap.length > 0 && last) {
      this._heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  /** @returns {boolean} */
  isEmpty() {
    return this._heap.length === 0;
  }

  /** @returns {number} */
  get size() {
    return this._heap.length;
  }

  /** @param {number} i */
  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._heap[parent].priority <= this._heap[i].priority) break;
      [this._heap[parent], this._heap[i]] = [this._heap[i], this._heap[parent]];
      i = parent;
    }
  }

  /** @param {number} i */
  _sinkDown(i) {
    const n = this._heap.length;
    while (true) {
      let smallest = i;
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      if (left < n && this._heap[left].priority < this._heap[smallest].priority) {
        smallest = left;
      }
      if (right < n && this._heap[right].priority < this._heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === i) break;
      [this._heap[smallest], this._heap[i]] = [this._heap[i], this._heap[smallest]];
      i = smallest;
    }
  }
}

/**
 * Creates an empty Batch object.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {string} key
 * @param {BatchableOrder} seedOrder
 * @returns {Batch}
 */
export function createBatch(key, seedOrder) {
  const uniq =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const id = `batch_${String(key).replace(/[^a-zA-Z0-9_-]/g, '_')}_${uniq}`;
  return {
    id,
    vendorId: seedOrder.vendorId,
    vertical: seedOrder.vertical,
    deliveryType: seedOrder.deliveryType,
    timeWindow: seedOrder.timeWindow,
    orderIds: [],
    orders: [],
    riderId: null,
    size: 0,
    createdAt: Date.now(),
    status: 'forming',
  };
}

/**
 * Resolves batch urgency: explicit priority wins; else createdAt (older = more urgent).
 * @param {BatchableOrder[]} orders
 * @returns {number}
 */
function batchUrgency(orders) {
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < orders.length; i += 1) {
    const o = orders[i];
    const value =
      o.priority != null && Number.isFinite(Number(o.priority))
        ? Number(o.priority)
        : Number.isFinite(Number(o.createdAt))
          ? Number(o.createdAt)
          : Number.POSITIVE_INFINITY;
    if (value < best) best = value;
  }
  return Number.isFinite(best) ? best : Date.now();
}

/**
 * Adds an order into a forming batch if capacity allows.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {Batch} batch
 * @param {BatchableOrder} order
 * @returns {boolean} whether the order was accepted
 */
export function addOrderToBatch(batch, order) {
  if (!batch || !order || batch.size >= MAX_BATCH_SIZE) return false;
  if (batch.orderIds.includes(order.id)) return false;

  batch.orders.push(order);
  batch.orderIds.push(order.id);
  batch.size = batch.orders.length;

  if (batch.size >= MIN_BATCH_SIZE) {
    batch.status = 'ready';
  }
  return true;
}

/**
 * Assigns a single rider to a ready batch.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {Batch} batch
 * @param {string} riderId
 * @returns {Batch}
 */
export function assignRiderToBatch(batch, riderId) {
  if (!batch || !riderId) return batch;
  if (batch.size < MIN_BATCH_SIZE) return batch;

  return {
    ...batch,
    riderId,
    status: 'assigned',
  };
}

/**
 * Groups orders into batches using HashMap + Queue + Priority Queue.
 *
 * Rules enforced:
 * - Same vendor, vertical, delivery type, time window
 * - Min 5 / Max 6 orders per batch
 * - One rider per finalized batch (via `riderPool` round-robin)
 *
 * Time Complexity:  O(n log k) where k = number of ready batches (heap ops)
 * Space Complexity: O(n)
 *
 * @param {BatchableOrder[]} orders
 * @param {object} [options]
 * @param {string[]} [options.riderPool] - Rider ids for assignment
 * @param {boolean} [options.includeForming=false] - Also return under-sized forming batches
 * @returns {Batch[]|{ batches: Batch[], orphans: BatchableOrder[], forming: Batch[] }}
 */
export function createBatches(orders, options = {}) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return options.includeForming
      ? { batches: [], orphans: [], forming: [] }
      : [];
  }

  /** @type {Map<string, Queue>} HashMap: batchKey → pending order queue */
  const groupQueues = new Map();
  /** @type {BatchableOrder[]} */
  const orphans = [];

  for (let i = 0; i < orders.length; i += 1) {
    const order = orders[i];
    if (!isBatchEligible(order)) {
      orphans.push(order);
      continue;
    }

    const key = buildBatchKey(order);
    if (!groupQueues.has(key)) {
      groupQueues.set(key, new Queue());
    }
    groupQueues.get(key).enqueue(order);
  }

  /** @type {PriorityQueue} ready batches, prioritized by urgency */
  const readyHeap = new PriorityQueue();
  /** @type {Batch[]} */
  const forming = [];
  /** @type {Batch[]} */
  const finalized = [];

  groupQueues.forEach((queue) => {
    let current = null;

    while (!queue.isEmpty()) {
      const order = queue.dequeue();
      if (!current) {
        current = createBatch(buildBatchKey(order), order);
      }

      const accepted = addOrderToBatch(current, order);
      if (!accepted) {
        if (current.size >= MIN_BATCH_SIZE) {
          readyHeap.insert(current, batchUrgency(current.orders));
        } else if (current.size > 0) {
          forming.push(current);
        }
        current = createBatch(buildBatchKey(order), order);
        addOrderToBatch(current, order);
      }

      if (current.size === MAX_BATCH_SIZE) {
        readyHeap.insert(current, batchUrgency(current.orders));
        current = null;
      }
    }

    if (current && current.size >= MIN_BATCH_SIZE) {
      readyHeap.insert(current, batchUrgency(current.orders));
    } else if (current && current.size > 0) {
      forming.push(current);
    }
  });

  const riders = Array.isArray(options.riderPool) ? options.riderPool.filter(Boolean) : [];
  let riderIndex = 0;

  while (!readyHeap.isEmpty()) {
    let batch = readyHeap.extractMin();
    if (!batch) break;

    if (riders.length > 0) {
      batch = assignRiderToBatch(batch, riders[riderIndex % riders.length]);
      riderIndex += 1;
    }

    finalized.push(batch);
  }

  if (options.includeForming) {
    return { batches: finalized, orphans, forming };
  }
  return finalized;
}

/**
 * Primary entry: batch a list of orders and return Batch objects.
 *
 * Time Complexity:  O(n log k)
 * Space Complexity: O(n)
 *
 * @param {BatchableOrder[]} orders
 * @param {object} [options]
 * @returns {Batch[]}
 */
export function batchOrders(orders, options = {}) {
  return createBatches(orders, options);
}
