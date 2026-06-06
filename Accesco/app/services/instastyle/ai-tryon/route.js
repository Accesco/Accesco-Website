export async function POST(request) {
  const formData = await request.formData();

  const person = formData.get('person');
  const shirt = formData.get('shirt');

  if (!person || !shirt) {
    return Response.json(
      { error: 'Person image and shirt image are required.' },
      { status: 400 }
    );
  }

  return Response.json(
    {
      success: false,
      message:
        'AI Try-On backend is not connected yet. Backend needs to expose an endpoint using the provided vto_hf.py script.',
    },
    { status: 501 }
  );
}