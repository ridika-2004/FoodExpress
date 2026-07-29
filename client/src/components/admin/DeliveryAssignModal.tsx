import { X, MapPin, Bike, Phone } from 'lucide-react';
import type { Order } from '../../data/mockData';
import { deliverymen } from '../../data/mockData';

interface DeliveryAssignModalProps {
  order: Order;
  onAssign: (orderId: string, deliverymanId: string) => void;
  onClose: () => void;
}

export default function DeliveryAssignModal({ order, onAssign, onClose }: DeliveryAssignModalProps) {
  const availableDeliverymen = deliverymen.filter(dm => dm.isAvailable);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Assign Delivery Partner</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-muted rounded-xl p-4 mb-5">
            <p className="text-sm font-bold text-foreground">{order.id}</p>
            <div className="flex items-start gap-2 text-sm mt-2">
              <MapPin size={14} className="text-foreground-muted mt-0.5 shrink-0" />
              <p className="text-foreground-muted text-xs">{order.deliveryAddress}</p>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Total: <strong>₱{order.total.toLocaleString()}</strong>
            </p>
          </div>

          <p className="text-sm font-semibold text-foreground mb-3">Available Delivery Partners</p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableDeliverymen.length > 0 ? (
              availableDeliverymen.map(dm => (
                <button
                  key={dm.id}
                  onClick={() => onAssign(order.id, dm.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left"
                >
                  <img src={dm.avatar} alt={dm.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{dm.name}</p>
                    <div className="flex items-center gap-3 text-xs text-foreground-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <Bike size={12} />
                        Delivery
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {dm.phone}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Available
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Bike size={28} className="mx-auto text-foreground-muted mb-2" />
                <p className="text-sm font-medium text-foreground">No delivery partners available</p>
                <p className="text-xs text-foreground-muted mt-1">All partners are currently on delivery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}