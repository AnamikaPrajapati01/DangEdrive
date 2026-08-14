import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireSession } from '@/lib/auth';
import { deletePayment, isStoreError } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession('admin');
    const { id } = await params;
    await deletePayment(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (isStoreError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('[DELETE /api/payments/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
