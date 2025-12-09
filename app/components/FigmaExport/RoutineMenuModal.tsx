import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { wp } from '../../../utils/scaling';

interface RoutineMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  title?: string;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  onToggleNotification?: () => void;
  onAutoComplete?: () => void;
  onManageSharedGoals?: () => void;
}

const RoutineMenuModal: React.FC<RoutineMenuModalProps> = ({
  visible,
  onClose,
  title,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleNotification,
  onAutoComplete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* 상단 핸들 */}
          <View style={styles.handle} />
          <Text style={styles.title}>{title || '루틴 선택'}</Text>


          {/* 액션 버튼들 */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/highlighter.png")} style={styles.iconImage} resizeMode="contain" />
              </View>
              <Text style={styles.actionText}>수정하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/delete.right.png")} style={styles.iconImage} resizeMode="contain" />
              </View>
              <Text style={styles.actionText}>삭제하기</Text>
            </TouchableOpacity>
          </View>

          {/* 메뉴 리스트 */}
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem} onPress={onToggleFavorite}>
              <View style={styles.menuIconCircle}>
                <Image source={require("../../../assets/user_profile.png")} style={{width: wp(40), height: wp(40), position: 'absolute'}} resizeMode="contain" />
                <Image source={require("../../../assets/Star 5.png")} style={{width: wp(20), height: wp(20)}} resizeMode="contain" />
              </View>
              <Text style={styles.menuText}>중요 일정 등록하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onToggleNotification}>
              <View style={styles.menuIconCircle}>
                <Image source={require("../../../assets/user_profile.png")} style={{width: wp(40), height: wp(40), position: 'absolute'}} resizeMode="contain" />
                <Image source={require("../../../assets/clock.png")} style={{width: wp(18), height: wp(18)}} resizeMode="contain" />
              </View>
              <Text style={styles.menuText}>루틴 등록하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onAutoComplete}>
              <View style={styles.menuIconCircle}>
                <Image source={require("../../../assets/user_profile.png")} style={{width: wp(40), height: wp(40), position: 'absolute'}} resizeMode="contain" />
                <Image source={require("../../../assets/flame.white.png")} style={{width: wp(18), height: wp(18)}} resizeMode="contain" />
              </View>
              <Text style={styles.menuText}>가족 공통 일정 등록하기</Text>
            </TouchableOpacity>

            {/* AD 배너 */}
            <View style={styles.adBanner}>
              <View style={styles.adBadge}>
                <Text style={styles.adBadgeText}>AD</Text>
              </View>
              <Text style={styles.adTitle}>Pakit Premium 구독</Text>
              <Text style={styles.adDescription}>Premium 구독하고 정밀화된 가족력...</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingHorizontal: wp(20),
    paddingTop: wp(16),
    paddingBottom: wp(34),
    minHeight: wp(400),
  },
  handle: {
    width: wp(134),
    height: wp(5),
    backgroundColor: '#D1D1D6',
    borderRadius: wp(100),
    alignSelf: 'center',
    marginBottom: wp(24),
  },
  title: {
    fontSize: wp(18),
    fontWeight: '700',
    color: '#2F2F2F',
    textAlign: 'center',
    marginBottom: wp(24),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: wp(24),
    gap: wp(12),
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#BDE5E2',
    borderRadius: wp(12),
    paddingVertical: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: wp(40),
    height: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp(8),
  },
  iconImage: {
    width: wp(24),
    height: wp(24),
  },
  actionText: {
    fontSize: wp(13),
    fontWeight: '600',
    color: '#08504A',
  },
  menuList: {
    gap: wp(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconCircle: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(12),
  },
  menuText: {
    fontSize: wp(14),
    color: '#2F2F2F',
    flex: 1,
  },
  adBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: wp(12),
    padding: wp(12),
    marginTop: wp(12),
  },
  adBadge: {
    backgroundColor: '#BDE5E2',
    paddingHorizontal: wp(6),
    paddingVertical: wp(3),
    borderRadius: wp(4),
    marginRight: wp(8),
  },
  adBadgeText: {
    fontSize: wp(9),
    fontWeight: '700',
    color: '#08504A',
  },
  adTitle: {
    fontSize: wp(12),
    fontWeight: '700',
    color: '#333',
    marginRight: wp(4),
  },
  adDescription: {
    fontSize: wp(11),
    color: '#989898',
    flex: 1,
  },
});

export default RoutineMenuModal;