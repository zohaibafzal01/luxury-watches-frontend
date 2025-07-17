import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InventoryItem } from '@/types/inventory';
import { 
  Plus, 
  Search, 
  Package,
  DollarSign,
  Edit,
  Trash2,
  Upload,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { InventoryItemModal } from './InventoryItemModal';
import { useToast } from '@/hooks/use-toast';

export const InventoryComponent: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: 'inv1',
        dealerId: 'dealer1',
        sku: 'RLX-SUB-001',
        brand: 'Rolex',
        model: 'Submariner',
        reference: '116610LN',
        year: 2020,
        condition: 'excellent',
        price: 12500,
        cost: 10000,
        quantity: 1,
        status: 'available',
        description: 'Black dial, ceramic bezel, excellent condition with box and papers',
        images: ['/api/placeholder/300/300'],
        specifications: {
          movement: 'Automatic',
          caseMaterial: 'Stainless Steel',
          caseSize: '40mm',
          dialColor: 'Black',
          strapMaterial: 'Stainless Steel',
          waterResistance: '300m',
          features: ['Date', 'Unidirectional Bezel']
        },
        stock: 1,
        tags: ['luxury', 'dive watch', 'rolex'],
        photos: ['/api/placeholder/300/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv2',
        dealerId: 'dealer1',
        sku: 'OMG-SPD-002',
        brand: 'Omega',
        model: 'Speedmaster',
        reference: '311.30.42.30.01.005',
        year: 2019,
        condition: 'very-good',
        price: 4200,
        cost: 3500,
        quantity: 2,
        status: 'available',
        description: 'Moonwatch Professional, manual wind',
        images: ['/api/placeholder/300/300'],
        specifications: {
          movement: 'Manual',
          caseMaterial: 'Stainless Steel',
          caseSize: '42mm',
          dialColor: 'Black',
          strapMaterial: 'Leather',
          waterResistance: '50m',
          features: ['Chronograph', 'Tachymeter']
        },
        stock: 2,
        tags: ['omega', 'chronograph', 'moonwatch'],
        photos: ['/api/placeholder/300/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv3',
        dealerId: 'dealer1',
        sku: 'CAR-SNT-003',
        brand: 'Cartier',
        model: 'Santos',
        reference: 'WSSA0029',
        year: 2021,
        condition: 'new',
        price: 6800,
        cost: 5500,
        quantity: 1,
        status: 'sold',
        description: 'Large model, steel case and bracelet',
        images: ['/api/placeholder/300/300'],
        specifications: {
          movement: 'Automatic',
          caseMaterial: 'Stainless Steel',
          caseSize: '39.8mm',
          dialColor: 'Silver',
          strapMaterial: 'Stainless Steel',
          waterResistance: '100m',
          features: ['Date', 'Roman Numerals']
        },
        stock: 1,
        tags: ['cartier', 'luxury', 'dress watch'],
        photos: ['/api/placeholder/300/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    setInventory(mockInventory);
  }, []);

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete ${item.brand} ${item.model}?`)) {
      setInventory(prev => prev.filter(i => i.id !== item.id));
      toast({
        title: 'Item Deleted',
        description: `${item.brand} ${item.model} has been removed from your inventory.`,
      });
    }
  };

  const handleMarkAsSold = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => 
      i.id === item.id ? { ...i, status: 'sold' } : i
    ));
    toast({
      title: 'Item Marked as Sold',
      description: `${item.brand} ${item.model} has been marked as sold.`,
    });
  };

  const handleViewPhotos = (item: InventoryItem) => {
    toast({
      title: 'View Photos',
      description: `Opening photo gallery for ${item.brand} ${item.model}...`,
    });
  };

  const handleImportCSV = () => {
    toast({
      title: 'Import CSV',
      description: 'CSV import functionality will be implemented soon.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Data',
      description: 'Exporting inventory data...',
    });
  };

  const filteredInventory = inventory.filter(item => {
    const searchText = `${item.brand} ${item.model} ${item.reference} ${item.sku}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || item.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500/20 text-green-700',
      'on-hold': 'bg-yellow-500/20 text-yellow-700',
      sold: 'bg-gray-500/20 text-gray-700',
      'in-service': 'bg-blue-500/20 text-blue-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      new: 'bg-green-500/20 text-green-700',
      excellent: 'bg-blue-500/20 text-blue-700',
      'very-good': 'bg-yellow-500/20 text-yellow-700',
      good: 'bg-orange-500/20 text-orange-700',
      fair: 'bg-red-500/20 text-red-700',
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCost = inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const availableItems = inventory.filter(item => item.status === 'available').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="luxury-title text-3xl mb-2">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage your watch inventory and track stock levels
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleImportCSV}>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="luxury-button" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-primary">{inventory.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-500">{availableItems}</p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-blue-500">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {totalCost > 0 ? Math.round(((totalValue - totalCost) / totalCost) * 100) : 0}%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by brand, model, SKU, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="luxury-input"
            />
          </div>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-48 luxury-input">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Rolex">Rolex</SelectItem>
              <SelectItem value="Omega">Omega</SelectItem>
              <SelectItem value="Cartier">Cartier</SelectItem>
              <SelectItem value="Patek Philippe">Patek Philippe</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 luxury-input">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="in-service">In Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              {filteredInventory.length} items found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.brand} {item.model}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {item.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-mono text-sm">{item.reference}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${item.cost.toLocaleString()}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      ${((item.price - item.cost) * item.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600" 
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {item.status === 'available' && (
                          <Button 
                            size="sm" 
                            className="luxury-button text-xs px-2" 
                            onClick={() => handleMarkAsSold(item)}
                          >
                            Sold
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewPhotos(item)}
                        >
                          Photos
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredInventory.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No inventory items found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || brandFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Add your first inventory item to get started'
                  }
                </p>
                <Button className="luxury-button" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inventory Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InventoryItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
      />
    </div>
  );
};
