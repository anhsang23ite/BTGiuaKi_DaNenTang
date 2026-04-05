// ProductListScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Button, Image, StyleSheet, 
  Alert, TouchableOpacity, RefreshControl 
} from 'react-native';

const ProductListScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const username = route.params?.user?.username || 'Admin';

  // Giả lập dữ liệu ban đầu (bạn có thể để mảng rỗng nếu muốn)
  useEffect(() => {
    // Dữ liệu mẫu (xóa nếu không muốn)
    setProducts([
      {
        id: '1',
        tensp: 'Áo Thun Cotton',
        loaisp: 'Áo nam',
        gia: 250000,
        hinhanh: 'https://via.placeholder.com/300x300/4CAF50/ffffff?text=Áo+Thun'
      },
      {
        id: '2',
        tensp: 'Quần Jeans Slim',
        loaisp: 'Quần nam',
        gia: 450000,
        hinhanh: 'https://via.placeholder.com/300x300/2196F3/ffffff?text=Jeans'
      }
    ]);
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive',
        onPress: () => {
          setProducts(prev => prev.filter(item => item.id !== id));
          Alert.alert('Đã xóa', 'Sản phẩm đã được xóa khỏi danh sách.');
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.hinhanh || 'https://via.placeholder.com/80?text=No+Image' }} 
        style={styles.image} 
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.tensp}</Text>
        <Text style={styles.category}>Loại: {item.loaisp}</Text>
        <Text style={styles.price}>
          {parseInt(item.gia || 0).toLocaleString('vi-VN')} VND
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProduct', { product: item })}
        >
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Có thể thêm logic refresh sau này
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chào {username} 👋</Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.addButtonText}>+ Thêm sản phẩm mới</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Chưa có sản phẩm nào trong phiên làm việc</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  header: { 
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#333'
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: { 
    width: 90, 
    height: 90, 
    borderRadius: 12,
    marginRight: 15 
  },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  category: { fontSize: 15, color: '#666', marginBottom: 6 },
  price: { fontSize: 17, fontWeight: '600', color: '#e91e63' },
  actions: { justifyContent: 'space-around', paddingLeft: 8 },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  editText: { color: '#2196F3', fontWeight: '600', fontSize: 16 },
  deleteButton: { backgroundColor: '#ffebee' },
  deleteText: { color: '#f44336', fontWeight: '600', fontSize: 16 },
  empty: { 
    textAlign: 'center', 
    marginTop: 80, 
    fontSize: 17, 
    color: '#888' 
  },
  listContent: { paddingBottom: 30 },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default ProductListScreen;