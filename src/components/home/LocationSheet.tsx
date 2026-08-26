import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { areas, type Area } from '../../data';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  visible: boolean;
  selectedId: string;
  /** Arenas available per area id, for the count beside each row. */
  counts: Record<string, number>;
  onClose: () => void;
  onSelect: (areaId: string) => void;
  /** Runs the GPS lookup; the screen owns the result. */
  onUseCurrentLocation: () => void;
  locating: boolean;
  /** Set when the last lookup failed, so the sheet can explain why. */
  locateError?: string;
};

export default function LocationSheet({
  visible,
  selectedId,
  counts,
  onClose,
  onSelect,
  onUseCurrentLocation,
  locating,
  locateError,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Choose area</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
            >
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: locating }}
            disabled={locating}
            onPress={onUseCurrentLocation}
            style={({ pressed }) => [
              styles.currentRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.currentIcon}>
              {locating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="navigate" size={16} color={colors.primary} />
              )}
            </View>

            <View style={styles.rowText}>
              <Text style={styles.currentTitle}>
                {locating ? 'Finding you…' : 'Use current location'}
              </Text>
              <Text style={styles.rowMeta}>
                {locateError ?? 'Detect the nearest area automatically'}
              </Text>
            </View>

            {!locating ? (
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            ) : null}
          </Pressable>

          <View style={styles.divider} />

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {areas.map((area: Area) => {
              const active = area.id === selectedId;
              const count = counts[area.id] ?? 0;

              return (
                <Pressable
                  key={area.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => onSelect(area.id)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <View style={[styles.pin, active && styles.pinActive]}>
                    <Ionicons
                      name="location-sharp"
                      size={15}
                      color={active ? colors.white : colors.muted}
                    />
                  </View>

                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, active && styles.rowTitleActive]}>
                      {area.name}
                    </Text>
                    <Text style={styles.rowMeta}>
                      {count} {count === 1 ? 'arena' : 'arenas'}
                    </Text>
                  </View>

                  {active ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,24,39,0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    maxHeight: '78%',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.sectionTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: screenPadding,
    paddingVertical: spacing.md,
  },
  currentIcon: {
    width: 34,
    height: 34,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: screenPadding,
    marginBottom: spacing.xs,
  },
  list: { paddingHorizontal: screenPadding },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowPressed: { opacity: 0.6 },
  pin: {
    width: 34,
    height: 34,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 17,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinActive: { backgroundColor: colors.primary },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  rowTitleActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  rowMeta: {
    marginTop: spacing.xs,
    fontSize: fontSize.caption,
    color: colors.muted,
  },
});
