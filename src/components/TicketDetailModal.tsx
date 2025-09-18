/**
 * 티켓 상세 모달 컴포넌트
 * 카드 뒤집기 애니메이션, 공유, 삭제, 수정 기능 포함
 * 모달 전체는 스크롤 X, 카드 내부만 스크롤 가능
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  Share,
  Animated,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ticket, UpdateTicketData } from '../types/ticket';
import { useAtom } from 'jotai';
import { deleteTicketAtom, updateTicketAtom, TicketStatus, getTicketByIdAtom } from '../atoms';
import { TicketDetailModalProps } from '../types/componentProps';

const { width } = Dimensions.get('window');

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  visible,
  ticket: propTicket,
  onClose,
  isMine = true,
}) => {
  const [, deleteTicket] = useAtom(deleteTicketAtom);
  const [, updateTicket] = useAtom(updateTicketAtom);
  const [getTicketById] = useAtom(getTicketByIdAtom);

  const ticket = propTicket ? getTicketById(propTicket.id) || propTicket : null;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Partial<UpdateTicketData>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(1)).current;

  if (!ticket) return null;

  const getStatusColor = (status: TicketStatus) =>
    status === TicketStatus.PUBLIC ? '#4ECDC4' : '#FF6B6B';

  // 카드 탭 핸들러 함수 추가
  const handleCardTap = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped);
    }
  };

  // 카드 회전: isEditing 또는 isFlipped 상태에 따라 자동 뒤집힘/복귀
  useEffect(() => {
    const toValue = isEditing || isFlipped ? 1 : 0;
    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isEditing, isFlipped]);

  // 모달 열릴 때 힌트 표시 및 편집 상태 초기화
  useEffect(() => {
    if (visible) {
      hintOpacity.setValue(1);
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }).start();
      setIsEditing(false);
      setIsFlipped(false);
      setEditedTicket({});
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowDropdown(false);
    }
  }, [visible]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎫 ${ticket.title}\n🎤 ${ticket.artist}\n📍 ${ticket.place}\n📅 ${ticket.performedAt.toLocaleDateString('ko-KR')}`,
        title: `${ticket.title} 티켓`,
      });
    } catch {
      Alert.alert('공유 실패', '티켓을 공유할 수 없습니다.');
    }
  };

  const handleEdit = () => {
    if (!ticket) return;
    setIsEditing(true);
    setShowDropdown(false); // 편집 시작할 때도 드롭다운 닫기
    setEditedTicket({
      title: ticket.title,
      artist: ticket.artist,
      place: ticket.place,
      performedAt: ticket.performedAt,
      review: ticket.review ? {
        reviewText: ticket.review.reviewText,
        createdAt: ticket.review.createdAt,
        updatedAt: new Date(),
      } : undefined,
    });
  };

  const handleSaveEdit = async () => {
    if (!ticket || !editedTicket) return;

    const title = editedTicket.title !== undefined ? editedTicket.title : ticket.title;
    const place = editedTicket.place !== undefined ? editedTicket.place : ticket.place;

    if (!title?.trim()) {
      Alert.alert('오류', '제목은 필수입니다.');
      return;
    }
    if (!place?.trim()) {
      Alert.alert('오류', '장소는 필수입니다.');
      return;
    }

    try {
      const result = updateTicket(ticket.id, editedTicket);
      if (result?.success) {
        setIsEditing(false);
        setEditedTicket({});
        setShowDropdown(false); // 드롭다운 닫기 추가
        Alert.alert('완료', '티켓이 수정되었습니다.');
      } else {
        Alert.alert('오류', result?.error?.message || '티켓 수정에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '티켓 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTicket({});
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowDropdown(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentTime = editedTicket.performedAt || ticket.performedAt;
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(currentTime.getHours());
      newDateTime.setMinutes(currentTime.getMinutes());
      setEditedTicket(prev => ({ ...prev, performedAt: newDateTime }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = editedTicket.performedAt || ticket.performedAt;
      const newDateTime = new Date(currentDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setEditedTicket(prev => ({ ...prev, performedAt: newDateTime }));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '티켓 삭제',
      `"${ticket.title}" 티켓을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const result = deleteTicket(ticket.id);
            if (result.success) {
              onClose();
              Alert.alert('완료', '티켓이 삭제되었습니다.');
            } else {
              Alert.alert('오류', result.error?.message || '티켓 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
    setShowDropdown(false);
  };

  const handleTogglePrivacy = () => {
    const newStatus = ticket.status === TicketStatus.PUBLIC ? TicketStatus.PRIVATE : TicketStatus.PUBLIC;
    Alert.alert(
      newStatus === TicketStatus.PUBLIC ? '티켓을 공개하시겠습니까?' : '티켓을 비공개하시겠습니까?',
      '',
      [
        { text: '취소', style: 'cancel' },
        {
          text: newStatus === TicketStatus.PUBLIC ? '공개하기' : '비공개하기',
          onPress: () => {
            const result = updateTicket(ticket.id, { status: newStatus });
            if (result?.success) {
              Alert.alert('완료', `티켓이 성공적으로 ${newStatus === TicketStatus.PUBLIC ? '공개되었습니다' : '비공개되었습니다'}.`);
              console.log('Ticket status updated to:', newStatus); // 콘솔 로그 추가
            } else {
              Alert.alert('오류', '상태 변경에 실패했습니다.');
            }
            setShowDropdown(false);
          },
        },
      ]
    );
  };

  const handleAddToPhoto = () => {
    Alert.alert('알림', '사진 앨범 저장 기능은 구현 예정입니다.');
    setShowDropdown(false);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              {isEditing && isMine ? (
                <>
                  <TouchableOpacity style={styles.actionButton} onPress={handleCancelEdit}>
                    <Text style={styles.actionButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSaveEdit}>
                    <Text style={[styles.actionButtonText, styles.saveButtonText]}>✓</Text>
                  </TouchableOpacity>
                </>
              ) : isMine ? (
                <>
                  <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Text style={styles.actionButtonText}>↗</Text>
                  </TouchableOpacity>
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation(); // 드롭다운을 열 때 외부 터치 이벤트 방지
                        setShowDropdown(!showDropdown);
                      }}
                    >
                      <Text style={styles.actionButtonText}>⋯</Text>
                    </TouchableOpacity>
                    {showDropdown && (
                      <View style={styles.dropdown}>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleEdit}>
                          <Text style={styles.dropdownText}>티켓 편집하기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleTogglePrivacy}>
                          <Text style={styles.dropdownText}>
                            {ticket.status === TicketStatus.PUBLIC ? '티켓 비공개하기' : '티켓 공개하기'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleAddToPhoto}>
                          <Text style={styles.dropdownText}>사진 앨범에 저장</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dropdownItem, styles.dropdownItemDanger]} onPress={handleDelete}>
                          <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>내 티켓 삭제하기</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <Text style={styles.actionButtonText}>↗</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.posterContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (showDropdown) {
                    setShowDropdown(false);
                  } else {
                    handleCardTap();
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={styles.flipContainer}>
                  <Animated.View
                    style={[styles.flipCard, styles.flipCardFront, frontAnimatedStyle]}
                  >
                    <Image
                      source={{
                        uri: ticket.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image',
                      }}
                      style={styles.posterImage}
                    />
                    <Animated.View style={[styles.tapHint, { opacity: hintOpacity }]}>
                      <Text style={styles.tapHintText}>탭하여 후기 보기</Text>
                    </Animated.View>
                  </Animated.View>
                  <Animated.View
                    style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}
                  >
                    <View style={styles.reviewCardContent}>
                      <Text style={styles.reviewCardTitle}>관람 후기</Text>
                      <ScrollView
                        style={styles.reviewScrollView}
                        contentContainerStyle={styles.reviewScrollContent}
                        showsVerticalScrollIndicator
                        nestedScrollEnabled
                      >
                        {isEditing ? (
                          <TextInput
                            style={styles.reviewInput}
                            value={editedTicket.review?.reviewText ?? ticket.review?.reviewText ?? ''}
                            onChangeText={(text) => setEditedTicket(prev => ({
                              ...prev,
                              review: {
                                reviewText: text,
                                createdAt: prev.review?.createdAt ?? new Date(),
                                updatedAt: new Date(),
                              }
                            }))}
                            placeholder="관람 후기를 입력하세요"
                            multiline
                            textAlignVertical="top"
                          />
                        ) : (
                          <Text style={styles.reviewText}>
                            {ticket.review?.reviewText ?? '후기가 없습니다.'}
                          </Text>
                        )}
                      </ScrollView>
                    </View>
                    <Animated.View style={[styles.tapHint, { opacity: hintOpacity }]}>
                      <Text style={styles.tapHintText}>탭하여 티켓 보기</Text>
                    </Animated.View>
                  </Animated.View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Title & Details */}
            <View style={styles.titleSection}>
              {isEditing ? (
                <TextInput
                  style={styles.titleInput}
                  value={editedTicket.title ?? ticket.title}
                  onChangeText={(text) => setEditedTicket(prev => ({ ...prev, title: text }))}
                  placeholder="공연 제목"
                  multiline
                  textAlign="center"
                />
              ) : (
                <Text style={styles.title}>{ticket.title}</Text>
              )}
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>일시</Text>
                {isEditing ? (
                  <View style={styles.dateTimeEditContainer}>
                    <TouchableOpacity style={styles.dateEditButton} onPress={() => setShowDatePicker(true)}>
                      <Text style={styles.dateEditText}>
                        {(editedTicket.performedAt ?? ticket.performedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timeEditButton} onPress={() => setShowTimePicker(true)}>
                      <Text style={styles.timeEditText}>
                        {(editedTicket.performedAt ?? ticket.performedAt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.detailValue}>
                    {ticket.performedAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}{' '}
                    {ticket.performedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Text>
                )}
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>장소</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={editedTicket.place ?? ticket.place}
                    onChangeText={(text) => setEditedTicket(prev => ({ ...prev, place: text }))}
                    placeholder="공연 장소"
                    textAlign="right"
                  />
                ) : (
                  <Text style={styles.detailValue}>{ticket.place}</Text>
                )}
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>출연</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={editedTicket.artist ?? ticket.artist}
                    onChangeText={(text) => setEditedTicket(prev => ({ ...prev, artist: text }))}
                    placeholder="출연진"
                    textAlign="right"
                  />
                ) : (
                  <Text style={styles.detailValue}>{ticket.artist}</Text>
                )}
              </View>
            </View>

          </View>

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={editedTicket.performedAt ?? ticket.performedAt}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={editedTicket.performedAt ?? ticket.performedAt}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 24, color: '#2C3E50', fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: 12 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: { fontSize: 18, color: '#2C3E50', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#4ECDC4' },
  saveButtonText: { color: '#FFF' },

  content: { flex: 1, backgroundColor: '#F8F9FA' },
  posterContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  flipContainer: {
    width: width * 0.85,
    aspectRatio: 0.8,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  flipCard: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  flipCardFront: { backgroundColor: '#FFF' },
  flipCardBack: { backgroundColor: '#FFF' },
  posterImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  tapHint: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 12,
    color: 'rgba(6, 5, 5, 0.8)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },

  reviewCardContent: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  reviewCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  reviewScrollView: {
    flex: 1,
    maxHeight: 350, // 스크롤 영역 높이 증가
    width: '105%', // 가로 넓이 직접 지정
    alignSelf: 'center',
  },
  reviewScrollContent: {
    flexGrow: 1, // minHeight 대신 flexGrow 사용
  },
  reviewText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'left',
  },

  titleSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },

  detailsSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  detailLabel: { fontSize: 16, color: '#7F8C8D', fontWeight: '500', flex: 1 , paddingHorizontal: 12,},
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
    paddingHorizontal: 12,
  },

  statusSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // 편집 모드 스타일
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  detailInput: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateTimeEditContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  dateEditButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 4,
  },
  timeEditButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateEditText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'right',
  },
  timeEditText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'right',
  },

  reviewInput: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'left',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
  },

  // 드롭다운 메뉴 스타일
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  dropdownItemDanger: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  },
  dropdownTextDanger: {
    color: '#FF6B6B',
  },
});

export default TicketDetailModal;