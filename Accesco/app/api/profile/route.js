import { NextResponse } from 'next/server';

import { adminDb } from '../../../lib/firebaseAdmin';

import { FieldValue } from 'firebase-admin/firestore';

import { verifyAuthToken } from '../_lib/auth';

import { isValidEmail, isValidPhone } from '../_lib/validators';

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile
 *
 * for fetching the authenticated user's profile.
 */
export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);

    if (error) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }

    const userRef = adminDb.collection('users').doc(uid);

    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    return NextResponse.json(
      {
        profile: {
          uid,

          name: data.name || '',

          phone: data.phone || '',

          email: data.email || null,

          photoURL: data.photoURL || null,

          deliveryAddress: data.deliveryAddress || null,

          phoneVerified: Boolean(data.phoneVerified),

          emailVerified: Boolean(data.emailVerified),

          provider: data.provider || 'phone',

          createdAt: data.createdAt || null,

          updatedAt: data.updatedAt || null,

          // Food preferences
          foodPreferences: {
            diet:
              data.foodPreferences?.diet ||
              'non-vegetarian',

            allergies:
              Array.isArray(data.foodPreferences?.allergies)
                ? data.foodPreferences.allergies
                : [],

            cuisines:
              Array.isArray(data.foodPreferences?.cuisines)
                ? data.foodPreferences.cuisines
                : [],
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Error fetching profile:',
      error
    );

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

 
export async function PUT(request) {
  try {
    const { uid, error } =
      await verifyAuthToken(request);

    if (error) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }

    const body = await request.json();

    const userRef =
      adminDb.collection('users').doc(uid);

    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

    const updateData = {};
   //personal information

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        'name'
      )
    ) {
      const name =
        typeof body.name === 'string'
          ? body.name.trim()
          : '';

      if (!name) {
        return NextResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        );
      }

      if (name.length > 100) {
        return NextResponse.json(
          {
            error:
              'Name must be under 100 characters',
          },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        'phone'
      )
    ) {
      const phone =
        typeof body.phone === 'string'
          ? body.phone.trim()
          : '';

      if (!phone || !isValidPhone(phone)) {
        return NextResponse.json(
          {
            error:
              'A valid phone number is required',
          },
          { status: 400 }
        );
      }

      updateData.phone = phone;

      // Phone changed → require verification again.
      if (phone !== existing.phone) {
        updateData.phoneVerified = false;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        'email'
      )
    ) {
      const email =
        typeof body.email === 'string'
          ? body.email.trim()
          : '';

      if (email && !isValidEmail(email)) {
        return NextResponse.json(
          {
            error:
              'Please provide a valid email address',
          },
          { status: 400 }
        );
      }

      updateData.email = email || null;

      // Email changed → require verification again.
      if (email !== (existing.email || '')) {
        updateData.emailVerified = false;
      }
    }
    ///food preferances

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        'foodPreferences'
      )
    ) {
      const preferences =
        body.foodPreferences;

      if (
        !preferences ||
        typeof preferences !== 'object' ||
        Array.isArray(preferences)
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid food preferences',
          },
          { status: 400 }
        );
      }

      /*
       * Dietary preference
       */
      const diet =
        typeof preferences.diet === 'string'
          ? preferences.diet.trim()
          : 'non-vegetarian';

      const allowedDiets = [
        'vegetarian',
        'vegan',
        'non-vegetarian',
      ];

      if (!allowedDiets.includes(diet)) {
        return NextResponse.json(
          {
            error:
              'Invalid dietary preference',
          },
          { status: 400 }
        );
      }

      /*
       * Allergies
       */
      let allergies =
        Array.isArray(preferences.allergies)
          ? preferences.allergies
          : [];

      allergies = allergies
        .filter(
          (item) => typeof item === 'string'
        )
        .map((item) => item.trim())
        .filter(Boolean);

      /*
       * Cuisines
       */
      let cuisines =
        Array.isArray(preferences.cuisines)
          ? preferences.cuisines
          : [];

      cuisines = cuisines
        .filter(
          (item) => typeof item === 'string'
        )
        .map((item) => item.trim())
        .filter(Boolean);

      /*
       * Save food preferences inside the user's
       * Firestore document.
       */
      updateData.foodPreferences = {
        diet,
        allergies,
        cuisines,
      };
    }

    /*
     * Don't perform an empty update.
     */
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error:
            'No profile data provided for update',
        },
        { status: 400 }
      );
    }

    /*
     * Always update the timestamp.
     */
    updateData.updatedAt =
      FieldValue.serverTimestamp();

    /*
     * Save everything to:
     *
     * users/{uid}
     */
    await userRef.update(updateData);

    /*
     * Return the updated values.
     */
    const updatedSnap =
      await userRef.get();

    const updated =
      updatedSnap.data();

    return NextResponse.json(
      {
        message:
          'Profile updated successfully',

        profile: {
          uid,

          name: updated.name || '',

          phone: updated.phone || '',

          email: updated.email || null,

          photoURL:
            updated.photoURL || null,

          deliveryAddress:
            updated.deliveryAddress || null,

          phoneVerified:
            Boolean(updated.phoneVerified),

          emailVerified:
            Boolean(updated.emailVerified),

          provider:
            updated.provider || 'phone',

          foodPreferences: {
            diet:
              updated.foodPreferences?.diet ||
              'non-vegetarian',

            allergies:
              Array.isArray(
                updated.foodPreferences?.allergies
              )
                ? updated.foodPreferences.allergies
                : [],

            cuisines:
              Array.isArray(
                updated.foodPreferences?.cuisines
              )
                ? updated.foodPreferences.cuisines
                : [],
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Error updating profile:',
      error
    );

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}