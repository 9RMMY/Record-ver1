/**
 * 주간 캘린더 컴포넌트
 * 월간 캘린더에서 스크롤 시 나타나는 주간 뷰
 * 선택된 주의 7일을 가로로 표시하며 각 날짜의 이벤트 표시
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ticket } from '../types/ticket';

interface WeeklyCalendarProps {
  selectedDate: string;
  tickets: Ticket[];
  onDayPress: (dateString: string) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  tickets,
  onDayPress,
}) => {
  // 선택된 날짜를 기준으로 해당 주의 시작일(일요일) 계산
  const getWeekStart = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0: 일요일, 1: 월요일, ...
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  // 주간 날짜 배열 생성 (일요일부터 토요일까지)
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // 해당 날짜에 티켓이 있는지 확인
  const hasTicket = (date: Date) => {
    const dateString = formatDate(date);
    return tickets.some(ticket => formatDate(new Date(ticket.performedAt)) === dateString);
  };

  // 해당 날짜의 티켓 개수 계산
  const getTicketCount = (date: Date) => {
    const dateString = formatDate(date);
    return tickets.filter(ticket => formatDate(new Date(ticket.performedAt)) === dateString).length;
  };

  const weekStart = getWeekStart(selectedDate);
  const weekDates = getWeekDates(weekStart);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 오늘 날짜
  const today = formatDate(new Date());

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDates.map((date, index) => {
          const dateString = formatDate(date);
          const isSelected = dateString === selectedDate;
          const isToday = dateString === today;
          const hasEvent = hasTicket(date);
          const ticketCount = getTicketCount(date);

          return (
            <TouchableOpacity
              key={dateString}
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay,
                isToday && !isSelected && styles.todayDay,
              ]}
              onPress={() => onDayPress(dateString)}
            >
              {/* 요일 표시 */}
              <Text style={[
                styles.dayName,
                isSelected && styles.selectedText,
                isToday && !isSelected && styles.todayText,
              ]}>
                {dayNames[index]}
              </Text>
              
              {/* 날짜 표시 */}
              <Text style={[
                styles.dayNumber,
                isSelected && styles.selectedText,
                isToday && !isSelected && styles.todayText,
              ]}>
                {date.getDate()}
              </Text>
              
              {/* 이벤트 표시 */}
              {hasEvent && (
                <View style={[
                  styles.eventIndicator,
                  isSelected && styles.selectedEventIndicator,
                ]}>
                  {ticketCount > 1 && (
                    <Text style={[
                      styles.eventCount,
                      isSelected && styles.selectedEventCount,
                    ]}>
                      {ticketCount}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 50,
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#B11515',
  },
  todayDay: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#B11515',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6C757D',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#B11515',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B11515',
  },
  selectedEventIndicator: {
    backgroundColor: '#FFFFFF',
  },
  eventCount: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 6,
  },
  selectedEventCount: {
    color: '#B11515',
  },
});

export default WeeklyCalendar;
