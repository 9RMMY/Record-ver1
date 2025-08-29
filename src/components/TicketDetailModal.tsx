import React, { useState, useRef } from 'react';
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
import { deleteTicketAtom } from '../atoms/ticketAtoms';

interface TicketDetailModalProps {
  visible: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  visible,
  ticket,
  onClose,
}) => {
  const [, deleteTicket] = useAtom(deleteTicketAtom);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  if (!ticket) return null;

  const getStatusColor = (status: '공개' | '비공개') => {
    switch (status) {
      case '공개':
        return '#4ECDC4';
      case '비공개':
        return '#FF6B6B';
      default:
        return '#E0E0E0';
    }
  };
  const handleShare = async () => {
    try {
      const shareContent = {
        message: `🎫 ${ticket.title}\n🎤 ${ticket.artist}\n📍 ${
          ticket.place
        }\n📅 ${ticket.performedAt.toLocaleDateString('ko-KR')}`,
        title: `${ticket.title} 티켓`,
      };
      await Share.share(shareContent);
    } catch (error) {
      Alert.alert('공유 실패', '티켓을 공유할 수 없습니다.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '티켓 삭제',
      `"${ticket.title}" 티켓을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
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

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

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
          <Text style={styles.headerTitle}>{isFlipped ? '후기' : '티켓'}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionButtonText}>↗</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Text style={styles.actionButtonText}>⋯</Text>
            </TouchableOpacity>
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
                  <View style={styles.posterWrapper}>
                    {ticket.images && ticket.images.length > 0 ? (
                      <Image
                        source={{ uri: ticket.images[0] }}
                        style={styles.posterImage}
                      />
                    ) : (
                      <View style={styles.placeholderPoster}>
                        <Text style={styles.placeholderText}>🎫</Text>
                        <Text style={styles.placeholderTitle}>
                          {ticket.title}
                        </Text>
                      </View>
                    )}
                    <View style={styles.tapHint}>
                      <Text style={styles.tapHintText}>탭하여 후기 보기</Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Back Side - Review */}
                <Animated.View
                  style={[
                    styles.flipCard,
                    styles.flipCardBack,
                    backAnimatedStyle,
                  ]}
                >
                  <View style={styles.reviewCardContent}>
                    <Text style={styles.reviewCardTitle}>관람 후기</Text>

                    {ticket.review ? (
                      <>
                        <ScrollView
                          style={styles.reviewTextContainer}
                          showsVerticalScrollIndicator={false}
                        >
                          <Text style={styles.reviewText}>
                            {ticket.review.reviewText}
                          </Text>
                        </ScrollView>

                        <View style={styles.reviewDate}>
                          <Text style={styles.reviewDateText}>
                            {ticket.createdAt?.toLocaleDateString('ko-KR')}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.noReviewContainer}>
                        <Text style={styles.noReviewEmoji}>✍️</Text>
                        <Text style={styles.noReviewText}>
                          아직 후기가 없습니다
                        </Text>
                        <Text style={styles.noReviewSubText}>
                          관람 후 소중한 후기를 남겨보세요
                        </Text>
                      </View>
                    )}

                    <View style={styles.tapHint}>
                      <Text style={styles.tapHintText}>탭하여 티켓 보기</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Title and Date */}
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

          {/* Event Details */}
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

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>좌석번호</Text>
              <Text style={styles.detailValue}>22번</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>예매처</Text>
              <Text style={styles.detailValue}>{ticket.bookingSite}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  posterContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  flipContainer: {
    width: width * 0.7,
    aspectRatio: 0.7,
  },
  flipCard: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  flipCardFront: {
    backgroundColor: 'transparent',
  },
  flipCardBack: {
    backgroundColor: '#FFFFFF',
  },
  posterWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tapHint: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#FFFFFF',
  },
  reviewCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  reviewTextContainer: {
    flex: 1,
    maxHeight: 200,
  },
  reviewText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'center',
  },
  reviewDate: {
    alignItems: 'center',
    marginTop: 16,
  },
  reviewDateText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  noReviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReviewEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noReviewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 8,
  },
  noReviewSubText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
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
  detailLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TicketDetailModal;
