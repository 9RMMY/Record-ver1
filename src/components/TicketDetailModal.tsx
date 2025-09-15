/**
 * 티켓 상세 모달 컴포넌트
 * 티켓 카드를 클릭했을 때 나타나는 상세 정보 모달
 * 카드 뒤집기 애니메이션, 공유, 삭제 기능 포함
 * isMine prop으로 내 티켓/친구 티켓 구분하여 삭제 버튼 표시 여부 결정
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
} from 'react-native';
import { Ticket } from '../types/ticket';
import { useAtom } from 'jotai';
import { deleteTicketAtom, TicketStatus } from '../atoms';
import { TicketDetailModalProps } from '../types/componentProps';

// 화면 너비 가져오기
const { width } = Dimensions.get('window');

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  visible,
  ticket,
  onClose,
  isMine = true, // 기본값은 내 티켓으로 설정 (삭제 버튼 표시)
}) => {
  const [, deleteTicket] = useAtom(deleteTicketAtom); // 티켓 삭제 함수
  const [isFlipped, setIsFlipped] = useState(false); // 카드 뒤집기 상태
  const flipAnimation = useRef(new Animated.Value(0)).current; // 뒤집기 애니메이션

  // 티켓 데이터가 없으면 모달을 렌더링하지 않음
  if (!ticket) {
    return null;
  }

  // 탭 힌트 투명도 애니메이션
  const hintOpacity = useRef(new Animated.Value(1)).current;

  // 공개/비공개 상태에 따른 색상 반환
  const getStatusColor = (status: TicketStatus) =>
    status === TicketStatus.PUBLIC ? '#4ECDC4' : '#FF6B6B';

  // 모달이 열리거나 카드를 뒤집을 때 힌트 페이드 인/아웃 효과
  useEffect(() => {
    if (visible) {
      hintOpacity.setValue(1);
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, isFlipped]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎫 ${ticket.title}\n🎤 ${ticket.artist}\n📍 ${
          ticket.place
        }\n📅 ${ticket.performedAt.toLocaleDateString('ko-KR')}`,
        title: `${ticket.title} 티켓`,
      });
    } catch {
      Alert.alert('공유 실패', '티켓을 공유할 수 없습니다.');
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
            deleteTicket(ticket.id);
            onClose();
            Alert.alert('완료', '티켓이 삭제되었습니다.');
          },
        },
      ],
    );
  };

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
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
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionButtonText}>↗</Text>
            </TouchableOpacity>
            {isMine && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Text style={styles.actionButtonText}>⋯</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Flippable Ticket Card */}
          <View style={styles.posterContainer}>
            <TouchableWithoutFeedback onPress={handleFlip}>
              <View style={styles.flipContainer}>
                {/* Front Side */}
                <Animated.View
                  style={[
                    styles.flipCard,
                    styles.flipCardFront,
                    frontAnimatedStyle,
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        ticket.images?.[0] ||
                        'https://via.placeholder.com/300x400?text=No+Image',
                    }}
                    style={styles.posterImage}
                  />
                  <Animated.View
                    style={[styles.tapHint, { opacity: hintOpacity }]}
                  >
                    <Text style={styles.tapHintText}>탭하여 후기 보기</Text>
                  </Animated.View>
                </Animated.View>

                {/* Back Side */}
                <Animated.View
                  style={[
                    styles.flipCard,
                    styles.flipCardBack,
                    backAnimatedStyle,
                  ]}
                >
                  <View style={styles.reviewCardContent}>
                    <Text style={styles.reviewCardTitle}>관람 후기</Text>
                    <ScrollView
                      style={styles.reviewTextContainer}
                      showsVerticalScrollIndicator={false}
                    >
                      <Text style={styles.reviewText}>
                        {ticket.review?.reviewText || '후기가 없습니다.'}
                      </Text>
                    </ScrollView>
                    <View style={styles.reviewDate}>
                      <Text style={styles.reviewDateText}>
                        {ticket.createdAt?.toLocaleDateString('ko-KR')}
                      </Text>
                    </View>
                    <Animated.View
                      style={[styles.tapHint, { opacity: hintOpacity }]}
                    >
                      <Text style={styles.tapHintText}>탭하여 티켓 보기</Text>
                    </Animated.View>
                  </View>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Title & Date */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{ticket.title}</Text>
            <Text style={styles.date}>
              {ticket.performedAt.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>일시</Text>
              <Text style={styles.detailValue}>
                {ticket.performedAt.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}{' '}
                {ticket.performedAt.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>장소</Text>
              <Text style={styles.detailValue}>{ticket.place}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>출연</Text>
              <Text style={styles.detailValue}>{ticket.artist}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(ticket.status) },
              ]}
            >
              <Text style={styles.statusText}>{ticket.status}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
    paddingTop: 60,
    paddingBottom: 20,
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
  content: { flex: 1, backgroundColor: '#F8F9FA' },
  posterContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
  },
  flipContainer: {
    width: width * 0.7,
    aspectRatio: 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
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
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  reviewCardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  reviewCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  reviewTextContainer: { flex: 1, maxHeight: 200 },
  reviewText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'center',
  },
  reviewDate: { alignItems: 'center', marginTop: 16 },
  reviewDateText: { fontSize: 12, color: '#95A5A6' },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: { fontSize: 16, color: '#7F8C8D' },
  detailsSection: {
    backgroundColor: '#FFF',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  detailLabel: { fontSize: 16, color: '#7F8C8D', fontWeight: '500', flex: 1 },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
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
});

export default TicketDetailModal;
