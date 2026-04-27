import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
  useAnimatedStyle,
  withDelay
} from 'react-native-reanimated';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  G,
  Line,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedView = Animated.createAnimatedComponent(View);

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

// --- Mock Data ---
const MOCK_DATA = {
  stability: {
    score: 78,
    data: [
      { month: 'Jan', value: 24 },
      { month: 'Feb', value: 26 },
      { month: 'Mar', value: 30 },
      { month: 'Apr', value: 36 },
    ],
    tooltip: 'Stability Improving',
  },
  cycleTrends: [
      { month: 'Jan', total: 28, lift: 0, greenTop: '40', redBottom: '0' },
      { month: 'Feb', total: 30, lift: 0, greenTop: '30', redBottom: '25' },
      { month: 'Mar', total: 28, lift: 0, greenTop: '35', redBottom: '25' },
      { month: 'Apr', total: 32, lift: 0, greenTop: '25', redBottom: '25' },
      { month: 'May', total: 28, lift: 0, greenTop: '30', redBottom: '25' },
      { month: 'Jun', total: 28, lift: 0, greenTop: '40', redBottom: '0%' },
    ],
  metabolicTrends: [
    { label: 'Jan', weight: 30 },
    { label: 'Feb', weight: 43 },
    { label: 'Mar', weight: 38 },
    { label: 'Apr', weight: 68 },
    { label: 'May', weight: 58 },
  ],
  metabolicWeekly: [
    { label: 'Mon', weight: 58 },
    { label: 'Tue', weight: 59 },
    { label: 'Wed', weight: 57 },
    { label: 'Thu', weight: 60 },
    { label: 'Fri', weight: 59 },
    { label: 'Sat', weight: 61 },
    { label: 'Sun', weight: 60 },
  ],
  
  bodySignals: [
    { label: 'Bloating', percentage: 31, color: '#D6D6FB' },
    { label: 'Fatigue', percentage: 21, color: '#F8B4B4' },
    { label: 'Acne', percentage: 17, color: '#A9D1A9' },
    { label: 'Mood', percentage: 30, color: '#FADBD8' },
  ],
  lifestyleImpact: [
    { label: 'Sleep', values: [1, 1, 1, 1, 1, 1, 1, 0, 0] },
    { label: 'Hydrate', values: [1, 1, 1, 0, 0, 0, 0, 0, 0] },
    { label: 'Caffeine', values: [1, 1, 1, 1, 1, 0, 0, 0, 0] },
    { label: 'Exercise', values: [1, 1, 1, 1, 0, 0, 0, 0, 0] },
  ],
};

// --- Sub-components ---

const HeaderNavigation = () => (
  <View style={styles.header}>
    <View style={styles.menuIcon}>
      <Svg width="20.5" height="20.5" viewBox="0 0 20.5 20.5">
        <Circle cx="5" cy="5" r="3.2" fill="#B4A8DA" />
        <Circle cx="15.5" cy="5" r="3.2" fill="#E4E0F3" />
        <Circle cx="5" cy="15.5" r="3.2" fill="#E4E0F3" />
        <Circle cx="15.5" cy="15.5" r="3.2" fill="#B4A8DA" />
      </Svg>
    </View>
    <Text style={{ 
      fontSize: 18, 
      fontWeight: '700', 
      color: '#101828',
      letterSpacing: -0.36,
    }}>Insights</Text>
    <View style={{ width: 24 }} />
  </View>
);

const StabilitySummary = () => {
  const chartHeight = 160;
  const chartWidth = CARD_WIDTH - 60;
  const data = MOCK_DATA.stability.data;
  
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
    opacity.value = withDelay(500, withTiming(1, { duration: 800 }));
  }, []);

  const points = data.map((d, i) => ({
    x: (i * chartWidth) / (data.length - 1),
    y: chartHeight - (d.value - 20) * 8,
  }));

  const animatedAreaProps = useAnimatedProps(() => {
    'worklet';
    const p = progress.value;
    let d = `M ${points[0].x} ${chartHeight - (chartHeight - points[0].y) * p}`;
    for (let i = 1; i < points.length; i++) {
      const pt = points[i];
      d += ` L ${pt.x} ${chartHeight - (chartHeight - pt.y) * p}`;
    }
    d += ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
    return { d };
  });

  const animatedLineProps = useAnimatedProps(() => {
    'worklet';
    const p = progress.value;
    let d = `M ${points[0].x} ${chartHeight - (chartHeight - points[0].y) * p}`;
    for (let i = 1; i < points.length; i++) {
      const pt = points[i];
      d += ` L ${pt.x} ${chartHeight - (chartHeight - pt.y) * p}`;
    }
    return { d };
  });

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#000000', 
        marginBottom: 12, 
        marginLeft: 16,
        letterSpacing: -0.32,
        lineHeight: 16,
      }}>Stability Summary</Text>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardSubtitle}>Based on your recent logs and symptom patterns.</Text>
        </View>
        
        <View style={styles.stabilityScoreContainer}>
          <Text style={styles.stabilityScoreLabel}>Stability Score</Text>
          <Text style={styles.stabilityScoreValue}>{MOCK_DATA.stability.score}%</Text>
        </View>
        
        <View style={styles.chartWrapper}>
          <View style={styles.yAxis}>
            <Text style={styles.axisText}>32d</Text>
            <Text style={styles.axisText}>28d</Text>
            <Text style={styles.axisText}>24d</Text>
          </View>

          <View style={styles.chartArea}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#EBEBFF" stopOpacity="0.8" />
                  <Stop offset="1" stopColor="#F5F5FF" stopOpacity="0.2" />
                </LinearGradient>
                <LinearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#BCA7FD" stopOpacity="0.4" />
                  <Stop offset="1" stopColor="#BCA7FD" stopOpacity="0.1" />
                </LinearGradient>
              </Defs>

              <AnimatedPath 
                animatedProps={useAnimatedProps(() => {
                  'worklet';
                  const p = progress.value;
                  let d = `M 0 ${chartHeight}`;
                  for (let i = 0; i < points.length; i++) {
                    const pt = points[i];
                    d += ` L ${pt.x} ${chartHeight - (chartHeight - pt.y) * p}`;
                  }
                  d += ` L ${chartWidth} ${chartHeight} Z`;
                  return { d };
                })} 
                fill="#D8CCFE"
                opacity={0.25}
              />
              
              <AnimatedPath 
                animatedProps={useAnimatedProps(() => {
                  'worklet';
                  const p = progress.value;
                  
                  // Calculate upper and lower points for the band
                  let d = `M 0 ${chartHeight - (chartHeight - (points[0].y - 12)) * p}`;
                  
                  // Forward for upper points
                  for (let i = 1; i < points.length; i++) {
                    const pt = points[i];
                    d += ` L ${pt.x} ${chartHeight - (chartHeight - (pt.y - 12)) * p}`;
                  }
                  
                  // Backward for lower points to close the shape
                  for (let i = points.length - 1; i >= 0; i--) {
                    const pt = points[i];
                    d += ` L ${pt.x} ${chartHeight - (chartHeight - (pt.y + 12)) * p}`;
                  }
                  
                  d += ' Z';
                  return { d };
                })} 
                fill="#BCA7FD"
                opacity={0.6}
              />

              <AnimatedPath 
                animatedProps={animatedLineProps}
                stroke="#BCA7FD" 
                strokeWidth="2.5" 
                fill="none" 
              />
              
              <Line 
                x1={points[2].x} y1={0} x2={points[2].x} y2={chartHeight} 
                stroke="#8E9E9E" strokeWidth="1.5" strokeDasharray="5 5" 
              />
              
              <AnimatedCircle 
                cx={points[2].x} 
                animatedProps={useAnimatedProps(() => {
                  'worklet';
                  return {
                    cy: chartHeight - (chartHeight - points[2].y) * progress.value 
                  };
                })} 
                r="6" 
                fill="#8E9E9E" 
              />
            </Svg>

            <Animated.View 
              style={[
                styles.tooltipContainer, 
                { left: points[2].x - 45 }, 
                useAnimatedStyle(() => ({
                  opacity: opacity.value,
                  transform: [
                    { translateY: (chartHeight - (chartHeight - points[2].y) * progress.value) - 75 }
                  ]
                }))
              ]}
            >
              <View style={[styles.tooltipBox, { backgroundColor: '#000000', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, minWidth: 100, alignItems: 'center' }]}>
                <Text style={[styles.tooltipTitle, { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginBottom: 2 }]}>Stability</Text>
                <Text style={[styles.tooltipSub, { color: '#FFFFFF', fontSize: 13, opacity: 0.9 }]} numberOfLines={1}>Improving</Text>
              </View>
              <View style={[styles.tooltipArrow, { borderTopColor: '#000000' }]} />
            </Animated.View>

            <View style={styles.xAxis}>
              {data.map((d, i) => (
                <Text key={i} style={[styles.axisText, d.month === 'Mar' && styles.axisTextActive]}>
                  {d.month}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const DropIcon = ({ color }: { color: string }) => (
  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.5C15.5899 21.5 18.5 18.5899 18.5 15C18.5 11.4101 12 3 12 3C12 3 5.5 11.4101 5.5 15C5.5 18.5899 8.41015 21.5 12 21.5Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

const OvumIcon = ({ color }: { color: string }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="1.5" />
    <Path
      d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const CycleTrendBar = ({ item, index, progress, standardTotal, standardHeight, gridBottom }: any) => {
  const itemHeight = (item.total / standardTotal) * standardHeight;
  
  const animatedBarStyle = useAnimatedStyle(() => ({
    height: withDelay(index * 100, withTiming(itemHeight * progress.value, { duration: 800 })),
    bottom: 10,
    opacity: withTiming(progress.value, { duration: 500 }),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    bottom: withDelay(index * 100, withTiming((itemHeight + 15) * progress.value + gridBottom, { duration: 800 })),
    opacity: withTiming(progress.value, { duration: 500 }),
  }));

  return (
    <View style={styles.barColumn}>
      <AnimatedView style={[styles.barValueContainer, animatedTextStyle]}>
        <Text style={styles.barValueText}>{item.total}</Text>
      </AnimatedView>
      <View style={styles.barWrapper}>
        <AnimatedView style={[styles.mainBar, animatedBarStyle]}>
          {/* Green Segment */}
          <View style={[styles.barSegment, styles.greenSegment, { top: item.greenTop } as any]}>
            <OvumIcon color="rgba(255,255,255,0.9)" />
          </View>
          {/* Red Segment */}
          <View style={[styles.barSegment, styles.redSegment, { bottom: item.redBottom } as any]}>
            <DropIcon color="rgba(255,255,255,0.9)" />
          </View>
        </AnimatedView>
      </View>
      <Text style={styles.barMonthText}>{item.month}</Text>
    </View>
  );
};

const CycleTrends = () => {
  const standardTotal = 28;
  const standardHeight = 150;
  const gridBottom = 40;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1)) }));
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#000000', 
        marginBottom: 12, 
        marginLeft: 16,
        letterSpacing: -0.32,
        lineHeight: 16,
      }}>Cycle Trends</Text>
      
      <View style={styles.card}>
        <View style={styles.cycleChartContainer}>
          <TouchableOpacity style={styles.navButton}>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke="#A8A8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.barsContainer}>
            {/* Grid Lines */}
            <View style={[styles.gridLines, { height: standardHeight, bottom: gridBottom }]}>
              <View style={[styles.gridLine, { bottom: 0 }]} />
              <View style={[styles.gridLine, { bottom: standardHeight / 2 }]} />
              <View style={[styles.gridLine, { bottom: standardHeight }]} />
            </View>

            {MOCK_DATA.cycleTrends.map((item, index) => (
              <CycleTrendBar 
                key={index}
                item={item}
                index={index}
                progress={progress}
                standardTotal={standardTotal}
                standardHeight={standardHeight}
                gridBottom={gridBottom}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.navButton}>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke="#A8A8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BodyMetabolicTrends = () => {
  const [activeTab, setActiveTab] = useState<'Monthly' | 'Weekly'>('Monthly');
  const chartWidth = CARD_WIDTH - 40;
  const chartHeight = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  
  // @ts-ignore - fixing linter error for now
  const data = activeTab === 'Monthly' ? MOCK_DATA.metabolicTrends : MOCK_DATA.metabolicWeekly;

  const getX = (index: number) => (index * (chartWidth - paddingLeft - paddingRight)) / (data.length - 1) + paddingLeft;
  const getY = (value: number) => chartHeight - ((value - 25) / (85 - 25)) * chartHeight;

  const points = data.map((d: any, i: number) => ({
    x: getX(i),
    y: getY(d.weight),
  }));

  const getPath = () => {
    if (points.length === 0) return '';
    
    // Starting extension - start closer to the first dot to avoid touching the Y-axis labels
    let path = `M ${points[0].x - 12} ${points[0].y + 8}`;
    path += ` L ${points[0].x} ${points[0].y}`; // Connect to the first dot
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      let cp1x, cp1y, cp2x, cp2y;
      
      if (i === 0) { // Jan to Feb
        // Peak BEFORE Feb: rise high and then start descending before hitting Feb
        cp1x = p0.x + (p1.x - p0.x) * 0.35;
        cp1y = p0.y - 35; // Significant rise
        cp2x = p0.x + (p1.x - p0.x) * 0.75;
        cp2y = p1.y - 25; // Still above p1 to ensure descent into p1
      } else if (i === 1) { // Feb to Mar
        // Descent AFTER Feb: continue the downward slope from Feb into a trough
        cp1x = p0.x + (p1.x - p0.x) * 0.3;
        cp1y = p0.y + 15; // Continue down
        cp2x = p0.x + (p1.x - p0.x) * 0.7;
        cp2y = p1.y + 10; // Curve into Mar from below
      } else if (i === 2) { // Mar to Apr
        // Sharp rise to a peak high above and LEFT of Apr
        cp1x = p0.x + (p1.x - p0.x) * 0.45;
        cp1y = p1.y - 50; // Very high peak
        cp2x = p1.x - 10;
        cp2y = p1.y - 10; // Descending into Apr
      } else { // Apr to May
        // Very steep descent after Apr, deep valley, then rise to a hump before May
        cp1x = p0.x + (p1.x - p0.x) * 0.35;
        cp1y = p0.y + 60; // Even deeper trough for that sharp "valley" look
        cp2x = p0.x + (p1.x - p0.x) * 0.8;
        cp2y = p1.y - 25; // Rise up more before May to create the hump
      }
      
      if (i === 0) {
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      } else {
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      }
    }
    
    // Final extension
    const last = points[points.length - 1];
    path += ` L ${last.x + 20} ${last.y + 15}`;
    
    return path;
  };

  const linePath = getPath();
  const areaPath = `${linePath} L ${points[points.length - 1].x + 15} ${chartHeight} L ${points[0].x - 10} ${chartHeight} Z`;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#000000', 
        marginBottom: 12, 
        marginLeft: 16,
        letterSpacing: -0.32,
        lineHeight: 16,
      }}>Body & Metabolic Trends</Text>
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500', 
              color: '#000000', 
              letterSpacing: 0,
              lineHeight: 14,
            }}>Your weight</Text>
            <Text style={[styles.cardSubtitle, { fontSize: 16, color: '#9CA3AF' }]}>in kg</Text>
          </View>
          <View style={[styles.segmentedControl, { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 4, minWidth: 160 }]}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.segmentBtn, 
                { borderRadius: 20, minWidth: 75, paddingVertical: 8 },
                activeTab === 'Monthly' && { backgroundColor: '#000' }
              ]}
              onPress={() => setActiveTab('Monthly')}
            >
              <Text style={[
                styles.segmentText, 
                { fontWeight: '700', fontSize: 13 },
                activeTab === 'Monthly' && { color: '#FFF' }
              ]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.segmentBtn, 
                { borderRadius: 20, minWidth: 75, paddingVertical: 8, backgroundColor: 'transparent' },
                activeTab === 'Weekly' && { backgroundColor: '#000' }
              ]}
              onPress={() => setActiveTab('Weekly')}
            >
              <Text style={[
                styles.segmentText, 
                { fontWeight: '700', fontSize: 13, color: '#9CA3AF' },
                activeTab === 'Weekly' && { color: '#FFF' }
              ]}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.metabolicChartWrapper, { marginTop: 40 }]}>
          <Svg width={chartWidth} height={chartHeight + 40} style={{ overflow: 'visible' }}>
            <Defs>
              <LinearGradient id="metabolicGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#F48E8E" stopOpacity="0.3" />
                <Stop offset="0.8" stopColor="#F48E8E" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#F48E8E" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Y-Axis Labels & Grid Lines */}
            {[25, 50, 75].map((label) => (
              <G key={label}>
                <Line
                  x1={paddingLeft}
                  y1={getY(label)}
                  x2={chartWidth - paddingRight}
                  y2={getY(label)}
                  stroke="#F3F4F6"
                  strokeDasharray="5 5"
                  strokeWidth="1.5"
                />
                <SvgText
                  x={0}
                  y={getY(label) + 5}
                  fontSize="14"
                  fill="#9CA3AF"
                  fontWeight="500"
                  fontFamily="System"
                >
                  {label}
                </SvgText>
              </G>
            ))}
            
            <Path 
              d={areaPath} 
              fill="url(#metabolicGrad)" 
            />
            <Path 
              d={linePath} 
              stroke="#F48E8E" 
              strokeWidth="3.5" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {points.map((p: any, i: number) => (
              <G key={i}>
                {/* Subtle shadow for the dot */}
                <Circle cx={p.x} cy={p.y + 1} r="11" fill="#000" fillOpacity="0.05" />
                {/* Large white outer circle */}
                <Circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="9" 
                  fill="#FFF" 
                />
                {/* Solid pink inner circle */}
                <Circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4.5" 
                  fill="#F48E8E" 
                />
              </G>
            ))}

            {/* X-Axis Labels */}
            {data.map((d: any, i: number) => (
              <SvgText
                key={i}
                x={getX(i)}
                y={chartHeight + 30}
                fontSize="14"
                fill="#9CA3AF"
                fontWeight="500"
                textAnchor="middle"
                fontFamily="System"
              >
                {d.label}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
};

const BodySignals = () => {
  const radius = 100;
  const strokeWidth = 55;
  const center = 135;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#000000', 
        marginBottom: 12, 
        marginLeft: 16,
        letterSpacing: -0.32,
        lineHeight: 16,
      }}>Body Signals</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: '#000000', 
            letterSpacing: -0.32,
            lineHeight: 16,
          }}>Symptom Trends</Text>
          <Text style={[styles.cardSubtitle, { fontSize: 18, color: '#9CA3AF' }]}>Compared to last cycle</Text>
        </View>
      
      <View style={[styles.donutContainer, { height: 280, marginTop: 5, alignItems: 'center', justifyContent: 'center' }]}>
        <Svg width="270" height="270" viewBox="0 0 270 270">
          <Defs>
            <LinearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFF1F1" />
              <Stop offset="100%" stopColor="#F4C3C4" />
            </LinearGradient>
            <LinearGradient id="acneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ECFFF9" />
              <Stop offset="100%" stopColor="#6E8C82" />
            </LinearGradient>
            <LinearGradient id="fatigueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E99597" />
              <Stop offset="100%" stopColor="#FFE4E4" />
            </LinearGradient>
            <LinearGradient id="bloatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#B4A8DA" />
              <Stop offset="100%" stopColor="#F5F2FF" />
            </LinearGradient>
          </Defs>
          {MOCK_DATA.bodySignals.map((item, index) => {
            // Add a tiny overlap (0.5%) to each segment to ensure no gaps between them
            const effectivePercentage = item.percentage + 0.5;
            const strokeDashoffset = circumference - (effectivePercentage / 100) * circumference;
            const rotation = (currentOffset / 100) * 360;
            currentOffset += item.percentage;
            
            let strokeColor = item.color;
            if (item.label === 'Mood') strokeColor = 'url(#moodGradient)';
            if (item.label === 'Acne') strokeColor = 'url(#acneGradient)';
            if (item.label === 'Fatigue') strokeColor = 'url(#fatigueGradient)';
            if (item.label === 'Bloating') strokeColor = 'url(#bloatingGradient)';
            
            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation - 90.5} ${center} ${center})`}
                fill="none"
              />
            );
          })}
        </Svg>
        
        {/* Floating label badges */}
        {MOCK_DATA.bodySignals.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.donutLabel, 
              getDonutLabelStyle(index),
              { 
                backgroundColor: '#FFF', 
                width: 72,
                height: 72,
                borderRadius: 36,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 10,
              }
            ]}
          >
            <Text style={[styles.donutLabelText, { fontSize: 16, fontWeight: '700', color: '#000' }]}>{item.percentage}%</Text>
            <Text 
              style={[styles.donutLabelSubtext, { fontSize: 12, color: '#000', marginTop: 1 }]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);
};

const getDonutLabelStyle = (index: number) => {
  const positions = [
    { top: 35, right: 25 },    // Bloating
    { bottom: 0, right: 60 }, // Fatigue
    { bottom: 10, left: 50 },  // Acne
    { top: 30, left: 30 },    // Mood
  ];
  return positions[index];
};

const LifestyleImpact = () => {
  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#000000', 
        marginBottom: 12, 
        marginLeft: 16,
        letterSpacing: -0.32,
        lineHeight: 16,
      }}>Lifestyle Impact</Text>
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: '#000000', 
            letterSpacing: -0.32,
            lineHeight: 16,
          }}>Correlation Strength</Text>
          <TouchableOpacity style={[styles.pill, { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }]}>
            <Text style={[styles.pillText, { fontSize: 14, color: '#667085' }]}>4 months</Text>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}>
              <Path d="M6 9L12 15L18 9" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.matrixContainer, { marginTop: 20 }]}>
          {MOCK_DATA.lifestyleImpact.map((row, i) => (
            <View key={i} style={[styles.matrixRow, { marginBottom: 20 }]}>
              <Text style={[styles.matrixLabel, { width: 70, fontSize: 14, color: '#111827', fontWeight: '500' }]}>{row.label}</Text>
              <View style={{ flex: 1, height: 32 }}>
                <Svg width="100%" height="32">
                  <Defs>
                    <LinearGradient id={`grad-Sleep`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#B4A8DA" />
                      <Stop offset="100%" stopColor="#F5F2FF" />
                    </LinearGradient>
                    <LinearGradient id={`grad-Hydrate`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#E99597" />
                      <Stop offset="100%" stopColor="#FFE4E4" />
                    </LinearGradient>
                    <LinearGradient id={`grad-Caffeine`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#ECFFF9" />
                      <Stop offset="100%" stopColor="#6E8C82" />
                    </LinearGradient>
                    <LinearGradient id={`grad-Exercise`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#FFF1F1" />
                      <Stop offset="100%" stopColor="#F4C3C4" />
                    </LinearGradient>
                  </Defs>
                  {row.values.map((v, j) => (
                    <Rect
                      key={j}
                      x={j * (100 / 9) + '%'}
                      y="0"
                      width={(100 / 9) - 2 + '%'}
                      height="32"
                      rx="6"
                      ry="6"
                      fill={v ? `url(#grad-${row.label})` : '#F2F4F7'}
                    />
                  ))}
                </Svg>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const CustomBottomTabBar = () => (
  <View style={styles.tabBarWrapper}>
    <View style={styles.tabBarMainContainer}>
      <TouchableOpacity style={styles.tabItem}>
        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <Path d="M3 10L12 3L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" fill="#98A2B3"/>
        </Svg>
        <Text style={[styles.tabText, { fontSize: 14, marginTop: 6 }]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem}>
        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke="#98A2B3" strokeWidth="2.5"/>
          <Path d="M12 7V12L15 15" stroke="#98A2B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={[styles.tabText, { fontSize: 14, marginTop: 6 }]}>Track</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem}>
        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          {/* Bar Chart */}
          <Rect x="5" y="14" width="3" height="6" rx="1" fill="#101828" />
          <Rect x="10.5" y="11" width="3" height="9" rx="1" fill="#101828" />
          <Rect x="16" y="13" width="3" height="7" rx="1" fill="#101828" />
          {/* Line with dots */}
          <Path d="M5 10L10.5 6L16 9L21 4" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="5" cy="10" r="1.5" fill="#101828" />
          <Circle cx="10.5" cy="6" r="1.5" fill="#101828" />
          <Circle cx="16" cy="9" r="1.5" fill="#101828" />
          <Circle cx="21" cy="4" r="1.5" fill="#101828" />
        </Svg>
        <Text style={[styles.tabText, styles.tabTextActive, { fontSize: 14, marginTop: 6 }]}>Insights</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.tabBarFabContainer}>
      <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19" stroke="#98A2B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M5 12H19" stroke="#98A2B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </Svg>
    </TouchableOpacity>
  </View>
);

const HomeIndicator = () => (
  <View style={styles.homeIndicatorWrapper}>
    <View style={styles.homeIndicator} />
  </View>
);

// --- Main Screen ---

const InsightsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderNavigation />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <StabilitySummary />
        <CycleTrends />
        <BodyMetabolicTrends />
        <BodySignals />
        <LifestyleImpact />
        <View style={{ height: 100 }} />
      </ScrollView>
      <CustomBottomTabBar />
      <HomeIndicator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7', // Subtle light-pink gradient equivalent
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardYellowBorder: {
    borderWidth: 1,
    borderColor: '#FFD700', // Yellow border as requested
    borderRadius: 0, // Removed border radius for sharp corners
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardSubtitleContainer: {
    marginTop: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#667085',
    marginTop: 4,
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  stabilityScoreContainer: {
    marginBottom: 20,
  },
  stabilityScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  stabilityScoreValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#101828',
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 150,
    paddingRight: 0,
    paddingBottom: 25, // Align with chart
  },
  chartArea: {
    flex: 1,
  },
  chartContainer: {
    alignItems: 'center',
  },
  axisText: {
    fontSize: 14,
    color: '#98A2B3',
  },
  axisTextActive: {
    color: '#101828',
    fontWeight: '700',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingHorizontal: 0,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#000000',
  },
  segmentText: {
    fontSize: 14,
    color: '#667085',
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  donutContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
  donutLabel: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  donutLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101828',
  },
  donutLabelSubtext: {
    fontSize: 10,
    color: '#667085',
  },
  pill: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    color: '#667085',
  },
  matrixContainer: {
    marginTop: 10,
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matrixLabel: {
    width: 60,
    fontSize: 12,
    color: '#667085',
  },
  matrixBlocks: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  matrixBlock: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 100,
  },
  tabBarMainContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    maxWidth: 320,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarFabContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#98A2B3',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#101828',
    fontWeight: '600',
  },
  metabolicChartWrapper: {
    flexDirection: 'row',
    marginTop: 20,
  },
  metabolicYAxis: {
    width: 30,
    height: 160,
    position: 'relative',
  },
  metabolicAxisText: {
    fontSize: 12,
    color: '#98A2B3',
    fontWeight: '500',
  },
  metabolicChartArea: {
    flex: 1,
    height: 220,
    position: 'relative',
  },
  metabolicGridLines: {
    position: 'absolute',
    width: '100%',
    height: 160,
    zIndex: -1,
  },
  metabolicGridLine: {
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#E4E7EC',
    borderStyle: 'dashed',
    width: '100%',
    position: 'absolute',
  },
  metabolicXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  cycleSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  cycleChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 240,
    marginHorizontal: 10,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    zIndex: -1,
  },
  gridLine: {
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#E4E7EC',
    borderStyle: 'dashed',
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  barColumn: {
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
    height: 250,
    justifyContent: 'flex-end',
  },
  barValueContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  barValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  barWrapper: {
    height: 200,
    width: 24,
    justifyContent: 'flex-end',
  },
  mainBar: {
    width: 24,
    backgroundColor: '#B8B8FF',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'absolute',
  },
  barSegment: {
    position: 'absolute',
    width: 24,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenSegment: {
    backgroundColor: '#6B8E8E',
  },
  redSegment: {
    backgroundColor: '#F48E8E',
  },
  barMonthText: {
    marginTop: 12,
    fontSize: 14,
    color: '#98A2B3',
  },
  stabilitySection: {
    marginTop: 10,
  },
  metabolicSection: {
    marginTop: 10,
  },
  externalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  tooltipContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 90,
  },
  tooltipBox: {
    backgroundColor: '#101828',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tooltipTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tooltipSub: {
    color: '#FFF',
    fontSize: 10,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#101828',
  },
});

export default InsightsScreen;
