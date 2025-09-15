/**
 * 캘린더 화면
 * 월별 달력 뷰에서 티켓들을 날짜별로 확인할 수 있는 페이지
 * 특정 날짜 선택 시 해당 날짜의 공연 목록을 하단에 표시
 */
import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../../atoms/ticketAtoms';
import { Ticket } from '../../types/ticket';
import TicketDetailModal from '../../components/TicketDetailModal';
import CalendarHeader from '../../components/CalendarHeader';
import CustomCalendar from '../../components/CustomCalendar';
import EventsList from '../../components/EventsList';
import { Colors } from '../../styles/designSystem';

// 캘린더 화면 Props 타입 정의
interface CalendarProps {
  navigation: any;
}

const CalendarScreen = () => {
  const navigation = useNavigation();
  // 선택된 날짜 상태 (오늘 날짜로 초기화)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [tickets] = useAtom(ticketsAtom); // 전체 티켓 목록
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // 선택된 티켓
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // 선택된 날짜의 공연 목록 필터링
  const selectedEvents = tickets.filter(
    ticket => formatDate(new Date(ticket.performedAt)) === selectedDate,
  );

  // 캘린더에서 날짜 선택 처리
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // 티켓 카드 클릭 시 상세 모달 열기
  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  // 티켓 상세 모달 닫기
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // 전체 티켓 개수 계산
  const totalTickets = tickets.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 캘린더 상단 헤더 - 총 티켓 개수 표시 */}
      <CalendarHeader totalTickets={totalTickets} />
      
      {/* 월별 캘린더 컴포넌트 */}
      <CustomCalendar
        selectedDate={selectedDate}
        tickets={tickets}
        onDayPress={handleDayPress}
      />
      
      {/* 선택된 날짜의 공연 목록 */}
      <EventsList
        selectedEvents={selectedEvents}
        onTicketPress={handleTicketPress}
      />

      {/* 티켓 상세 모달 */}
      {selectedTicket && (
        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
          isMine={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.systemBackground,
  },
});

export default CalendarScreen;
