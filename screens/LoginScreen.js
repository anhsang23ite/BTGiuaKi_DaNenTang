import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const showAlert = (title, message) => Alert.alert(title, message);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return showAlert('Lỗi', 'Vui lòng nhập Username và Password');
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", username.trim());
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.data();
        if (userData.password === password) {
          // Truyền thông tin user sang màn ProductList
          navigation.replace('ProductList', { user: { username: userData.username } });
        } else {
          showAlert('Lỗi', 'Mật khẩu không đúng!');
        }
      } else {
        showAlert('Lỗi', `Tài khoản "${username}" không tồn tại!`);
      }
    } catch (error) {
      showAlert('Lỗi kết nối', 'Không thể kết nối với Firestore.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) return showAlert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    if (password.length < 4) return showAlert('Lỗi', 'Mật khẩu phải ít nhất 4 ký tự');

    setLoading(true);
    try {
      const userRef = doc(db, "users", username.trim());
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        showAlert('Lỗi', `Tài khoản "${username}" đã tồn tại!`);
      } else {
        await setDoc(userRef, { username: username.trim(), password });
        showAlert('Thành công', `Đăng ký "${username}" thành công!`);
        setIsRegisterMode(false);
        setPassword('');
      }
    } catch (error) {
      showAlert('Lỗi', 'Không thể đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isRegisterMode ? 'Đăng ký Admin' : 'Đăng nhập Admin'}</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />

      <Pressable style={styles.mainButton} onPress={isRegisterMode ? handleRegister : handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegisterMode ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</Text>}
      </Pressable>

      <Pressable style={styles.switchButton} onPress={() => { setIsRegisterMode(!isRegisterMode); setPassword(''); }}>
        <Text style={styles.switchText}>
          {isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký mới'}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 18, borderRadius: 12, fontSize: 16 },
  mainButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchButton: { marginTop: 25, padding: 10 },
  switchText: { color: '#007AFF', textAlign: 'center', fontSize: 16 },
});

export default LoginScreen;