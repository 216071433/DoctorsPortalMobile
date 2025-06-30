import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Login from "./Login";

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <Login />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  closeButton: { alignSelf: "flex-end", marginBottom: 10 },
  closeText: { color: "#9b87f5", fontWeight: "bold" },
});

export default SignInModal;