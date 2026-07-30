import { Service } from '../types';

export const openBookingPopup = (service?: Service | null) => {
  window.dispatchEvent(new CustomEvent('acek_open_booking', { detail: { service: service || null } }));
};
