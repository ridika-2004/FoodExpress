export type UserRole = 'user' | 'restaurant' | 'deliveryman';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isAvailable?: boolean; // For deliverymen
  restaurantId?: string; // For restaurant owners
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  isOpen: boolean;
  isPromoted?: boolean;
  categories: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurantName: string;
  restaurantImage: string;
  restaurantId: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  driverName?: string;
  driverPhone?: string;
  driverImage?: string;
  deliverymanId?: string;
}

export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { id: '2', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { id: '3', name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop' },
  { id: '4', name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
  { id: '5', name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop' },
  { id: '6', name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop' },
  { id: '7', name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { id: '8', name: 'BBQ', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    cuisine: 'Italian • Pizza',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 'Free',
    minOrder: '₱150',
    isOpen: true,
    isPromoted: true,
    categories: ['Pizza', 'Italian'],
  },
  {
    id: '2',
    name: 'Burger Haven',
    image: 'https://images.unsplash.com/photo-1561758033-7e924f619f47?w=600&h=400&fit=crop',
    cuisine: 'American • Burgers',
    rating: 4.6,
    deliveryTime: '20-30 min',
    deliveryFee: '₱20',
    minOrder: '₱100',
    isOpen: true,
    isPromoted: true,
    categories: ['Burger', 'American'],
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    cuisine: 'Japanese • Sushi',
    rating: 4.9,
    deliveryTime: '30-45 min',
    deliveryFee: '₱30',
    minOrder: '₱200',
    isOpen: true,
    categories: ['Sushi', 'Japanese'],
  },
  {
    id: '4',
    name: 'Pasta Amore',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
    cuisine: 'Italian • Pasta',
    rating: 4.5,
    deliveryTime: '25-40 min',
    deliveryFee: 'Free',
    minOrder: '₱180',
    isOpen: true,
    categories: ['Pasta', 'Italian'],
  },
  {
    id: '5',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    cuisine: 'Indian • Curry',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: '₱25',
    minOrder: '₱150',
    isOpen: true,
    categories: ['BBQ', 'Indian'],
  },
  {
    id: '6',
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    cuisine: 'Healthy • Salads',
    rating: 4.4,
    deliveryTime: '15-25 min',
    deliveryFee: 'Free',
    minOrder: '₱120',
    isOpen: false,
    categories: ['Salad', 'Healthy'],
  },
  {
    id: '7',
    name: 'Sweet Tooth',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop',
    cuisine: 'Desserts • Bakery',
    rating: 4.3,
    deliveryTime: '20-30 min',
    deliveryFee: '₱15',
    minOrder: '₱80',
    isOpen: true,
    categories: ['Dessert'],
  },
  {
    id: '8',
    name: 'BBQ Nation',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop',
    cuisine: 'Barbecue • Grills',
    rating: 4.8,
    deliveryTime: '35-50 min',
    deliveryFee: '₱35',
    minOrder: '₱250',
    isOpen: true,
    isPromoted: true,
    categories: ['BBQ', 'American'],
  },
];

export const menuItems: Record<string, MenuItem[]> = {
  '1': [
    { id: '101', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, basil', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', category: 'Pizza', isPopular: true, isVegetarian: true },
    { id: '102', name: 'Pepperoni Pizza', description: 'Double pepperoni, mozzarella, signature sauce', price: 369, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', category: 'Pizza', isPopular: true },
    { id: '103', name: 'BBQ Chicken Pizza', description: 'Grilled chicken, BBQ sauce, red onions', price: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', category: 'Pizza' },
    { id: '104', name: 'Garlic Bread', description: 'Toasted ciabatta with garlic butter', price: 129, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12520?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
    { id: '105', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 179, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', category: 'Desserts', isVegetarian: true },
  ],
  '2': [
    { id: '201', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato, special sauce', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', category: 'Burgers', isPopular: true },
    { id: '202', name: 'Bacon Deluxe', description: 'Double beef, bacon, onion rings, BBQ sauce', price: 299, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', category: 'Burgers', isPopular: true },
    { id: '203', name: 'Chicken Crisp', description: 'Crispy chicken fillet, coleslaw, mayo', price: 229, image: 'https://images.unsplash.com/photo-1606755962773-d324e9d0ca44?w=400&h=300&fit=crop', category: 'Burgers' },
    { id: '204', name: 'Truffle Fries', description: 'Hand-cut fries with truffle oil & parmesan', price: 149, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
    { id: '205', name: 'Milkshake', description: 'Thick vanilla/chocolate/strawberry shake', price: 129, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', category: 'Drinks', isVegetarian: true },
  ],
  '3': [
    { id: '301', name: 'Salmon Nigiri (6 pcs)', description: 'Fresh Atlantic salmon over seasoned rice', price: 399, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', category: 'Nigiri', isPopular: true },
    { id: '302', name: 'Dragon Roll (8 pcs)', description: 'Shrimp tempura, avocado, eel sauce', price: 459, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop', category: 'Rolls', isPopular: true },
    { id: '303', name: 'Veggie Maki', description: 'Cucumber, avocado, carrot, bell pepper', price: 249, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', category: 'Rolls', isVegetarian: true },
    { id: '304', name: 'Miso Soup', description: 'Traditional tofu, seaweed, green onion', price: 99, image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59e?w=400&h=300&fit=crop', category: 'Soups', isVegetarian: true },
    { id: '305', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 119, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80171?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
  ],
  '4': [
    { id: '401', name: 'Spaghetti Carbonara', description: 'Creamy egg sauce, pancetta, pecorino', price: 329, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', category: 'Pasta', isPopular: true },
    { id: '402', name: 'Penne Arrabbiata', description: 'Spicy tomato sauce, garlic, chili flakes', price: 279, image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400&h=300&fit=crop', category: 'Pasta', isVegetarian: true },
    { id: '403', name: 'Fettuccine Alfredo', description: 'Butter, cream, parmesan, black pepper', price: 309, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop', category: 'Pasta', isVegetarian: true },
    { id: '404', name: 'Bruschetta', description: 'Toasted bread, tomato, basil, balsamic', price: 139, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
    { id: '405', name: 'Panna Cotta', description: 'Vanilla cream dessert with berry coulis', price: 159, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', category: 'Desserts', isVegetarian: true },
  ],
  '5': [
    { id: '501', name: 'Butter Chicken', description: 'Creamy tomato curry with tandoori chicken', price: 349, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', category: 'Curry', isPopular: true },
    { id: '502', name: 'Biryani', description: 'Fragrant basmati with spiced chicken & saffron', price: 329, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', category: 'Rice', isPopular: true },
    { id: '503', name: 'Garlic Naan', description: 'Tandoor-baked bread with garlic butter', price: 69, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', category: 'Breads', isVegetarian: true },
    { id: '504', name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin & ghee', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', category: 'Curry', isVegetarian: true },
    { id: '505', name: 'Mango Lassi', description: 'Chilled yogurt drink with mango pulp', price: 99, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop', category: 'Drinks', isVegetarian: true },
  ],
  '7': [
    { id: '701', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 199, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop', category: 'Cakes', isPopular: true, isVegetarian: true },
    { id: '702', name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar', price: 179, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop', category: 'Desserts', isVegetarian: true },
    { id: '703', name: 'Strawberry Cheesecake', description: 'New York style with fresh strawberry glaze', price: 219, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop', category: 'Cakes', isVegetarian: true },
    { id: '704', name: 'Macarons (6 pcs)', description: 'Assorted French macarons', price: 249, image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop', category: 'Pastries', isVegetarian: true },
  ],
  '8': [
    { id: '801', name: 'Beef Ribs (Full Rack)', description: 'Slow-smoked, house BBQ glaze, coleslaw', price: 599, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', category: 'BBQ', isPopular: true },
    { id: '802', name: 'Pulled Pork Sandwich', description: 'Smoked pork shoulder, tangy slaw, brioche', price: 329, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', category: 'Sandwiches', isPopular: true },
    { id: '803', name: 'Grilled Chicken Wings (8 pcs)', description: 'Choice of buffalo, honey BBQ, or garlic', price: 269, image: 'https://images.unsplash.com/photo-1608039829572-88652398bc63?w=400&h=300&fit=crop', category: 'BBQ' },
    { id: '804', name: 'Corn on the Cob', description: 'Grilled with butter, chili & lime', price: 79, image: 'https://images.unsplash.com/photo-1561758033-48d5260ae085?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
    { id: '805', name: 'Loaded Nachos', description: 'Crisps, cheese, jalapeños, sour cream, salsa', price: 229, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop', category: 'Sides', isVegetarian: true },
  ],
};

// All orders — restaurant owners see these
export const allOrders: Order[] = [
  {
    id: 'FD-2024-001',
    items: [
      { menuItem: menuItems['1'][0], restaurantId: '1', restaurantName: 'Pizza Palace', quantity: 2 },
      { menuItem: menuItems['1'][3], restaurantId: '1', restaurantName: 'Pizza Palace', quantity: 1 },
    ],
    restaurantName: 'Pizza Palace',
    restaurantImage: restaurants[0].image,
    restaurantId: '1',
    total: 727,
    status: 'out_for_delivery',
    estimatedDelivery: '7:45 PM',
    deliveryAddress: '123 Main Street, Apt 4B, Downtown',
    paymentMethod: 'Credit Card •••• 4242',
    createdAt: '2024-12-15T18:30:00Z',
    driverName: 'John Cruz',
    driverPhone: '+63 912 345 6789',
    driverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    deliverymanId: 'dm1',
  },
  {
    id: 'FD-2024-002',
    items: [
      { menuItem: menuItems['2'][0], restaurantId: '2', restaurantName: 'Burger Haven', quantity: 1 },
      { menuItem: menuItems['2'][3], restaurantId: '2', restaurantName: 'Burger Haven', quantity: 1 },
    ],
    restaurantName: 'Burger Haven',
    restaurantImage: restaurants[1].image,
    restaurantId: '2',
    total: 348,
    status: 'delivered',
    estimatedDelivery: '1:15 PM',
    deliveryAddress: '456 Oak Avenue, Village Center',
    paymentMethod: 'GCash',
    createdAt: '2024-12-14T12:30:00Z',
    deliverymanId: 'dm1',
  },
  {
    id: 'FD-2024-003',
    items: [
      { menuItem: menuItems['3'][0], restaurantId: '3', restaurantName: 'Sushi Master', quantity: 2 },
    ],
    restaurantName: 'Sushi Master',
    restaurantImage: restaurants[2].image,
    restaurantId: '3',
    total: 798,
    status: 'pending',
    estimatedDelivery: '8:30 PM',
    deliveryAddress: '789 Pine Road, Suite 200',
    paymentMethod: 'Credit Card •••• 1234',
    createdAt: '2024-12-15T19:00:00Z',
  },
  {
    id: 'FD-2024-004',
    items: [
      { menuItem: menuItems['5'][0], restaurantId: '5', restaurantName: 'Spice Garden', quantity: 1 },
      { menuItem: menuItems['5'][2], restaurantId: '5', restaurantName: 'Spice Garden', quantity: 2 },
    ],
    restaurantName: 'Spice Garden',
    restaurantImage: restaurants[4].image,
    restaurantId: '5',
    total: 487,
    status: 'confirmed',
    estimatedDelivery: '8:15 PM',
    deliveryAddress: '321 Maple Lane',
    paymentMethod: 'GCash',
    createdAt: '2024-12-15T19:15:00Z',
  },
  {
    id: 'FD-2024-005',
    items: [
      { menuItem: menuItems['7'][0], restaurantId: '7', restaurantName: 'Sweet Tooth', quantity: 2 },
      { menuItem: menuItems['7'][3], restaurantId: '7', restaurantName: 'Sweet Tooth', quantity: 1 },
    ],
    restaurantName: 'Sweet Tooth',
    restaurantImage: restaurants[6].image,
    restaurantId: '7',
    total: 647,
    status: 'preparing',
    estimatedDelivery: '8:00 PM',
    deliveryAddress: '555 Desert Blvd',
    paymentMethod: 'Cash',
    createdAt: '2024-12-15T18:45:00Z',
  },
];

// For regular users, their orders (subset)
export const orders: Order[] = allOrders.slice(0, 2);

// Delivery fleet shown to restaurant owners for order assignment.
// These are NOT authenticatable accounts — authentication comes only from the backend.
export const deliverymen: AppUser[] = [
  {
    id: 'dm1',
    name: 'John Cruz',
    email: 'john@foodexpress.com',
    phone: '+63 912 345 6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    role: 'deliveryman',
    isAvailable: true,
  },
  {
    id: 'dm2',
    name: 'Maria Santos',
    email: 'maria@foodexpress.com',
    phone: '+63 913 456 7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    role: 'deliveryman',
    isAvailable: true,
  },
];