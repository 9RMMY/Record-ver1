import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
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

  useEffect(() => {
    // Save the complete ticket with review and images
    if (ticketData) {
      addTicket({
        ...ticketData,
        review: reviewData,
        images: images || [],
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
            <Text style={styles.ticketHeaderText}>JAMONG</Text>
            <Text style={styles.ticketHeaderText}>SALGU CLUB</Text>
            <View style={styles.starsContainer}>
              {[...Array(8)].map((_, i) => (
                <Text key={i} style={[styles.star, { 
                  top: Math.random() * 40,
                  right: Math.random() * 60 + 10,
                  fontSize: Math.random() * 8 + 12
                }]}>★</Text>
              ))}
            </View>
          </View>

          {/* Main Ticket Content */}
          <View style={styles.ticketMain}>
            <View style={styles.circleContainer}>
              <Text style={styles.circleText}>Jamong</Text>
              <Text style={styles.circleText}>Salgu</Text>
              <Text style={styles.circleText}>Club</Text>
              <Text style={styles.circleStars}>✦</Text>
            </View>
          </View>

          {/* Ticket Footer */}
          <View style={styles.ticketFooter}>
            <Text style={styles.footerText}>
              {ticketData?.title || 'JAMONG SALGU CLUB'}
            </Text>
            <Text style={styles.footerSubtext}>
              {ticketData?.place || 'TOMORROW'} • {ticketData?.performedAt ? 
                new Date(ticketData.performedAt).toLocaleDateString('ko-KR', { 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'JAN 31'} • 8PM
            </Text>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeElements}>
            <Text style={styles.decorativeText}>SECRET CLUB OF THOSE WHO</Text>
            <Text style={styles.decorativeText}>WANT TO DIE (???) BUT ACTUALLY</Text>
            <Text style={styles.decorativeText}>WANT TO LIVE (?!?)</Text>
            <View style={styles.sideText}>
              <Text style={styles.sideTextContent}>
                IF YOU WANT TO JOIN, BRING THE TICKET{'\n'}
                ON THE BACK AND COME THE MUSIC ROOM
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator}>
        <View style={styles.indicator} />
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
  starsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
  },
  star: {
    position: 'absolute',
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  ticketMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circleContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF6B47',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  circleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  circleStars: {
    fontSize: 20,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 30,
    right: 30,
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
  decorativeElements: {
    position: 'absolute',
    left: 15,
    top: 120,
    transform: [{ rotate: '-90deg' }],
  },
  decorativeText: {
    fontSize: 8,
    color: '#2C3E50',
    marginBottom: 2,
    fontWeight: '500',
  },
  sideText: {
    position: 'absolute',
    right: -100,
    bottom: 100,
    transform: [{ rotate: '90deg' }],
    width: 200,
  },
  sideTextContent: {
    fontSize: 8,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 12,
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  indicator: {
    width: 134,
    height: 5,
    backgroundColor: '#2C3E50',
    borderRadius: 2.5,
  },
});

export default TicketCompletePage;
