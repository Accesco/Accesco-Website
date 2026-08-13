from pathlib import Path

import random
import numpy as np
import torch


def set_seed(seed: int):

    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def create_directories(*directories):
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)