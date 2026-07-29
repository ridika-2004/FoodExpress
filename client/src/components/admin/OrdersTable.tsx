import { Package } from 'lucide-react';
import type { Order } from '../../data/mockData';
import { deliverymen } from '../../data/mockData';
import { statusConfig } from './constants';

interface OrdersTableProps {
  orders: Order[];
  onAssign: (order: Order) => void;
  onMarkDelivered: (orderId: string) => void;
}

export default function OrdersTable({ orders, onAssign, onMarkDelivered }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
        <Package size={36} className="mx-auto text-foreground-muted mb-3" />
        <p className="text-lg font-bold text-foreground">No orders found</p>
        <p className="text-sm text-foreground-muted mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Order</th>
              <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Items</th>
              <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Total</th>
              <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Delivery Partner</th>
              <th className="text-right px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const status = statusConfig[order.status];
              const assignedDm = order.deliverymanId
                ? deliverymen.find(d => d.id === order.deliverymanId)
                : null;
              return (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-foreground text-sm">{order.items.length} item(s)</p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {order.items.map(i => i.menuItem.name).join(', ').slice(0, 40)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-foreground">₱{order.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    {assignedDm ? (
                      <div className="flex items-center gap-2">
                        <img src={assignedDm.avatar} alt={assignedDm.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-sm text-foreground">{assignedDm.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground-muted">Not assigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <button
                          onClick={() => onAssign(order)}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 cursor-pointer active:scale-[0.97]"
                        >
                          {order.deliverymanId ? 'Reassign' : 'Assign'}
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => onMarkDelivered(order.id)}
                          className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 cursor-pointer active:scale-[0.97]"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}