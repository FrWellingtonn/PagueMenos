import { useState } from 'react';
import { Search, Calendar, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockSales, mockProducts, Sale, Product } from '../data/mockData';

export function SalesHistory() {
  const [searchCpf, setSearchCpf] = useState('');
  const [customerSales, setCustomerSales] = useState<Sale[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (!searchCpf.trim()) return;
    
    const cleanCpf = searchCpf.replace(/\D/g, '');
    
    const sales = mockSales.filter(sale => {
      const saleCleanCpf = sale.patientCpf.replace(/\D/g, '');
      return saleCleanCpf === cleanCpf || sale.patientCpf === searchCpf;
    });
    
    setCustomerSales(sales);
    setIsSearched(true);
    
    if (sales.length > 0) {
      generateRecommendations(sales);
    } else {
      setRecommendations([]);
    }
  };

  const generateRecommendations = (sales: Sale[]) => {
    const purchasedCategories = new Set<string>();
    sales.forEach(sale => {
      sale.products.forEach(product => {
        purchasedCategories.add(product.category);
      });
    });

    const recommended = mockProducts.filter(product => 
      purchasedCategories.has(product.category) && 
      !sales.some(sale => 
        sale.products.some(p => p.name === product.name)
      )
    );

    setRecommendations(recommended.slice(0, 3));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const totalSpent = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="h-screen overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Vendas</h1>
          <p className="text-gray-600">Consulte o histórico de compras por CPF</p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar por CPF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Digite o CPF (ex: 123.456.789-00)"
              value={searchCpf}
              onChange={(e) => setSearchCpf(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearched && (
        <>
          {customerSales.length > 0 ? (
            <>
              {/* Customer Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total de Compras</p>
                        <p className="text-xl font-bold">{customerSales.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Valor Total Gasto</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Última Compra</p>
                        <p className="text-xl font-bold">{formatDate(customerSales[0].date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales History */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Compras - {customerSales[0].patientName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSales.map((sale) => (
                      <div key={sale.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">{formatDate(sale.date)} - {sale.time}</p>
                            <p className="text-sm text-gray-600">Atendido por: {sale.pharmacist}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(sale.totalAmount)}</p>
                            <Badge variant="outline">{sale.paymentMethod}</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {sale.products.map((product) => (
                            <div key={product.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Qtd: {product.quantity}</p>
                                <p className="font-medium">{formatCurrency(product.total)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Produtos Recomendados
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Baseado no histórico de compras do cliente
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendations.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-sm">{product.name}</h3>
                              <Badge variant="secondary">{product.category}</Badge>
                            </div>
                            <p className="text-xs text-gray-600">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">{product.manufacturer}</p>
                              <p className="font-bold text-green-600">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma compra encontrada
                </h3>
                <p className="text-gray-600">
                  Não foram encontradas compras para o CPF informado.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}