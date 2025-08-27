import React from 'react';
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
        message: `🎫 ${ticket.title}\n🎤 ${ticket.artist}\n📍 ${ticket.place}\n📅 ${ticket.performedAt.toLocaleDateString('ko-KR')}\n${ticket.review ? `⭐ ${ticket.review.rating}/5 - ${ticket.review.reviewText}` : ''}`,
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
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating && styles.starActive]}>
          ★
        </Text>
      );
    }
    return stars;
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
          <View style={styles.dragHandle} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Ticket Info */}
          <View style={styles.ticketSection}>
            <View style={styles.titleRow}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                <Text style={styles.statusText}>{ticket.status}</Text>
              </View>
            </View>
            
            <Text style={styles.ticketInfo}>🎤 {ticket.artist}</Text>
            <Text style={styles.ticketInfo}>📍 {ticket.place}</Text>
            <Text style={styles.ticketInfo}>📅 {ticket.performedAt.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}</Text>
            <Text style={styles.ticketInfo}>🎫 {ticket.bookingSite}</Text>
            <Text style={styles.dateText}>
              업데이트: {ticket.updatedAt.toLocaleDateString('ko-KR')}
            </Text>
          </View>

          {/* Review Section */}
          {ticket.review && (
            <View style={styles.reviewSection}>
              <Text style={styles.sectionTitle}>후기</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(ticket.review.rating)}
                </View>
                <Text style={styles.ratingText}>{ticket.review.rating}/5</Text>
              </View>
              <Text style={styles.reviewText}>{ticket.review.reviewText}</Text>
            </View>
          )}

          {/* Images Section */}
          {ticket.images && ticket.images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={styles.sectionTitle}>사진 ({ticket.images.length})</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScrollView}
              >
                {ticket.images.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.ticketImage} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* No Review/Images Message */}
          {!ticket.review && (!ticket.images || ticket.images.length === 0) && (
            <View style={styles.noContentSection}>
              <Text style={styles.noContentText}>아직 후기나 사진이 없습니다</Text>
              <Text style={styles.noContentSubtext}>
                티켓을 생성할 때 후기와 사진을 추가해보세요!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#BDC3C7',
    borderRadius: 2,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  ticketSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ticketInfo: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
    lineHeight: 24,
  },
  dateText: {
    fontSize: 12,
    color: '#BDC3C7',
    marginTop: 8,
  },
  reviewSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 20,
    color: '#E0E0E0',
    marginRight: 2,
  },
  starActive: {
    color: '#F39C12',
  },
  ratingText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  imagesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imagesScrollView: {
    marginTop: 8,
  },
  imageContainer: {
    marginRight: 12,
  },
  ticketImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  noContentSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noContentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BDC3C7',
    marginBottom: 8,
    textAlign: 'center',
  },
  noContentSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TicketDetailModal;
