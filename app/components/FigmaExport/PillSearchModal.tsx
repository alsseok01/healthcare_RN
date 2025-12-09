import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { wp } from '../../../utils/scaling';

interface PillSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onSearch: () => void;
}

const PillSearchModal = ({ visible, onClose, onCamera, onSearch }: PillSearchModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          {/* 핸들 바 */}
          <View style={styles.handleBar} />
          
          {/* 타이틀 */}
          <Text style={styles.title}>복용약 검색하기</Text>
          
          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCamera}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/camera.png")} style={{ width: wp(30), height: wp(30) }} resizeMode="contain" />
              </View>
              <Text style={styles.buttonText}>카메라 촬영</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={onSearch}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/magnifyingglass.png")} style={{ width: wp(30), height: wp(30) }} resizeMode="contain" />
              </View>
              <Text style={styles.buttonText}>검색하기</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingTop: wp(12),
    paddingBottom: wp(40),
    paddingHorizontal: wp(20),
    minHeight: wp(280),
  },
  handleBar: {
    width: wp(134),
    height: wp(5),
    backgroundColor: '#D1D1D6',
    borderRadius: wp(2.5),
    alignSelf: 'center',
    marginBottom: wp(20),
  },
  title: {
    fontSize: wp(18),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: wp(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: wp(12),
    justifyContent: 'center',
  },
  button: {
    width: wp(160),
    height: wp(100),
    backgroundColor: '#BDE5E2',
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(8),
  },
  iconContainer: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: wp(24),
  },
  buttonText: {
    fontSize: wp(14),
    fontWeight: '600',
    color: '#08504a',
  },
});

export default PillSearchModal;
