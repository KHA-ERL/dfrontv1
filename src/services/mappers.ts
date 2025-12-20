import { API_BASE } from './api';

function normalizeUrl(url: string): string {
  if (!url) return url;
  return url.startsWith('/uploads') ? `${API_BASE}${url}` : url;
}

export function mapUserPublic(raw: any) {
  if (!raw) return undefined;
  const fullName = raw.full_name ?? raw.fullName ?? '';
  return {
    id: raw.id,
    full_name: raw.full_name ?? fullName,
    fullName,
    email: raw.email,
    whatsapp: raw.whatsapp ?? '',
    houseAddress: raw.house_address ?? raw.houseAddress ?? '',
    substituteAddress: raw.substitute_address ?? raw.substituteAddress ?? '',
  };
}


export function mapSeller(raw: any) {
  return mapUserPublic(raw);
}

export function mapProduct(raw: any) {
  if (!raw) return undefined;

  const images = (raw.images || []).map((u: string) => normalizeUrl(u));
  const videos = (raw.videos || []).map((u: string) => normalizeUrl(u));

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price ?? 0,
    condition: raw.condition ?? '',
    location_state: raw.location_state ?? '',
    locationState: raw.location_state ?? '',
    delivery_fee: raw.delivery_fee ?? raw.deliveryFee ?? 0,
    deliveryFee: raw.delivery_fee ?? raw.deliveryFee ?? 0,
    images,
    videos,
    sellerId: raw.seller_id ?? raw.sellerId,
    createdAt: raw.created_at,
    isDisabled: raw.is_disabled ?? raw.isDisabled ?? false,
    seller: raw.seller ? mapSeller(raw.seller) : undefined,
    type: raw.type ?? 'Declutter',
    quantity: raw.quantity ?? 1,
    active: raw.active ?? true,
  };
}

export function mapOrder(raw: any) {
  if (!raw) return undefined;

  const product = raw.product ? mapProduct(raw.product) : undefined;
  const buyer = raw.buyer ? mapUserPublic(raw.buyer) : undefined;
  const seller = raw.seller ? mapUserPublic(raw.seller) : undefined;

  // derive satisfaction state properly
  const satisfactionStatusRaw =
    raw.satisfaction_status ??
    raw.satisfactionStatus ??
    (raw.satisfied
      ? 'SATISFIED'
      : raw.status === 'DELIVERED'
      ? 'NOT_SATISFIED'
      : 'PENDING');

  const satisfactionStatus = String(satisfactionStatusRaw).toUpperCase();

  const price = raw.price ?? 0;
  const deliveryFee = raw.delivery_fee ?? raw.deliveryFee ?? 0;
  const totalAmount = price + deliveryFee;

  return {
    id: String(raw.id),
    reference: raw.reference ?? '',
    productId: String(raw.product_id ?? raw.productId ?? product?.id ?? ''),
    buyerId: String(raw.buyer_id ?? raw.buyerId ?? buyer?.id ?? ''),
    sellerId: String(raw.seller_id ?? raw.sellerId ?? seller?.id ?? ''),
    product,
    buyer,
    seller,

    price,
    deliveryFee,
    totalAmount,

    status: (raw.status ?? '').toUpperCase(),
    satisfied: !!raw.satisfied,

    createdAt: raw.created_at,
    deliveredAt: raw.received_at,

    satisfactionStatus,
  };
}
