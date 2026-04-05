// EditProductScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CLOUD_NAME = "dqvhegjkr";
const UPLOAD_PRESET = "my_preset";

const uploadToCloudinary = async (uri) => {
  const data = new FormData();
  data.append("file", { uri, type: "image/jpeg", name: "image.jpg" });
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  if (!result.secure_url) throw new Error("Upload thất bại");
  return result.secure_url;
};

const EditProductScreen = ({ navigation, route }) => {
  const { product } = route.params;

  const [tensp, setTensp] = useState(product.tensp || '');
  const [loaisp, setLoaisp] = useState(product.loaisp || '');
  const [gia, setGia] = useState(product.gia?.toString() || '');
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setSelectedImageUri(result.assets[0].uri);
  };

  const handleEdit = async () => {
    if (!tensp || !loaisp || !gia) return Alert.alert('Lỗi', 'Nhập đủ thông tin');

    setLoading(true);
    let hinhanh = product.hinhanh || '';

    try {
      if (selectedImageUri) {
        const manipulated = await ImageManipulator.manipulateAsync(
          selectedImageUri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        hinhanh = await uploadToCloudinary(manipulated.uri);
      }

      await updateDoc(doc(db, "products", product.id), {
        tensp,
        loaisp,
        gia: parseFloat(gia),
        hinhanh,
        updatedAt: new Date(),
      });

      Alert.alert('Thành công', 'Đã cập nhật sản phẩm!');
      navigation.replace("ProductList");   // ← như yêu cầu
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>ID: {product.id}</Text>

      <TextInput style={styles.input} value={tensp} onChangeText={setTensp} placeholder="Tên sản phẩm" />
      <TextInput style={styles.input} value={loaisp} onChangeText={setLoaisp} placeholder="Loại sản phẩm" />
      <TextInput style={styles.input} value={gia} onChangeText={setGia} placeholder="Giá" keyboardType="numeric" />

      <Button title="Chọn ảnh mới (nếu muốn thay)" onPress={pickImage} />

      {(selectedImageUri || product.hinhanh) && (
        <Image
          source={{ uri: selectedImageUri || product.hinhanh }}
          style={styles.preview}
        />
      )}

      <Button title="Cập nhật" onPress={handleEdit} disabled={loading} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 15 }} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  preview: { width: 220, height: 220, alignSelf: 'center', marginVertical: 15, borderRadius: 12 },
});

export default EditProductScreen;