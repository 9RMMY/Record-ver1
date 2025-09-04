import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { useAtom } from 'jotai';
import { addTicketAtom } from '../atoms/ticketAtoms';

interface TicketCompletePageProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
      images?: string[];
    };
  };
}

const { width, height } = Dimensions.get('window');

const TicketCompletePage: React.FC<TicketCompletePageProps> = ({ navigation, route }) => {
  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;
  const images = route?.params?.images;
  const [, addTicket] = useAtom(addTicketAtom);

  // Get the first image (likely AI generated) to display on ticket
  const ticketImage = images && images.length > 0 ? images[0] : null;

  useEffect(() => {
    // Save the complete ticket with review and images
    if (ticketData) {
      addTicket({
        ...ticketData,
        review: reviewData,
        images: images || [],
        status: '공개', // Default status for new tickets
      });
    }

    // Auto-navigate to home after 5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation, ticketData, reviewData, images, addTicket]);

  const handleBackPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>새로운 티켓 생성 완료~!</Text>
        <Text style={styles.subtitle}>하나의 추억을 저장했어요.</Text>

        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketHeaderText}>{ticketData.title}</Text>
          </View>

          {/* Main Ticket Content */}
          <View style={styles.ticketMain}>
            {ticketImage ? (
              <Image
                source={{ uri: ticketImage }}
                style={styles.ticketImage}
              />
            ) : (
              <View style={styles.ticketPlaceholder}>
                <Text style={styles.placeholderText}>🎫</Text>
              </View>
            )}
          </View>

          {/* Ticket Footer */}
          <View style={styles.ticketFooter}>
            <Text style={styles.footerText}>{ticketData?.title}</Text>
            <Text style={styles.footerSubtext}>
              {ticketData?.place} •{' '}
              {ticketData?.performedAt
                ? new Date(ticketData.performedAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'JAN 31'}{' '}
              • 8PM
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#2C3E50',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  ticketCard: {
    width: width - 60,
    height: height * 0.6,
    backgroundColor: '#8FBC8F',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  ticketHeader: {
    padding: 20,
    position: 'relative',
  },
  ticketHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 2,
  },
  ticketMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  ticketPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  ticketFooter: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default TicketCompletePage;
