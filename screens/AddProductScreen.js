// AddProductScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CLOUD_NAME = "dqvhegjkr";     // ← thay bằng cloud name thật
const UPLOAD_PRESET = "my_preset";        // ← preset của bạn

const uploadToCloudinary = async (uri) => {
  const data = new FormData();
  data.append("file", { uri, type: "image/jpeg", name: "image.jpg" });
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  if (!result.secure_url) throw new Error("Upload ảnh thất bại: " + JSON.stringify(result));
  return result.secure_url;
};

const AddProductScreen = ({ navigation }) => {
  const [tensp, setTensp] = useState('');
  const [loaisp, setLoaisp] = useState('');
  const [gia, setGia] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!tensp || !loaisp || !gia) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }

    setLoading(true);
    let hinhanh = '';

    try {
      let finalUri = imageUri;

      // Resize ảnh trước khi upload (rất khuyến khích)
      if (imageUri) {
        const manipulated = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = manipulated.uri;
        hinhanh = await uploadToCloudinary(finalUri);
      }

      await addDoc(collection(db, "products"), {
        tensp,
        loaisp,
        gia: parseFloat(gia),
        hinhanh,
        createdAt: new Date(),
      });

      Alert.alert('Thành công', 'Thêm sản phẩm thành công!');
      navigation.replace("ProductList");   // ← như yêu cầu của bạn
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', error.message || 'Không thể thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Tên sản phẩm" value={tensp} onChangeText={setTensp} />
      <TextInput style={styles.input} placeholder="Loại sản phẩm" value={loaisp} onChangeText={setLoaisp} />
      <TextInput style={styles.input} placeholder="Giá" value={gia} onChangeText={setGia} keyboardType="numeric" />

      <Button title="Chọn hình ảnh" onPress={pickImage} />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <Button title="Thêm sản phẩm" onPress={handleAdd} color="#4CAF50" disabled={loading} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  preview: { width: 220, height: 220, marginVertical: 15, alignSelf: 'center', borderRadius: 12 },
});

export default AddProductScreen;