import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { wp } from '../../../utils/scaling';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onFamilyAnalysis: () => void;
  onAlarmSettings: () => void;
  onAIChat: () => void;
}

const MenuModal = ({ visible, onClose, onFamilyAnalysis, onAlarmSettings, onAIChat }: MenuModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={onFamilyAnalysis}>
            <Text style={styles.menuText}>가족력 분석하기</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={onAlarmSettings}>
            <Text style={styles.menuText}>복용약 검색하기</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={onAIChat}>
            <Image source={require("../../../assets/graduationcap.png")} style={{ width: wp(16), height: wp(16), position: 'absolute', left: wp(16), top: wp(12) }} resizeMode="contain" />
            <Text style={styles.menuText}> AI박사 이용하기</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: wp(60),
    paddingRight: wp(20),
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(5),
    width: wp(112),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: wp(12),
    paddingHorizontal: wp(16),
  },
  menuText: {
    fontSize: wp(13),
    color: '#000',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default MenuModal;
