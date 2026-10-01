import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface KeywordItem {
  key: string;
  label: string;
  isCustom?: boolean;
}

export const PRESET_KEYWORDS: KeywordItem[] = [
  { key: 'space', label: 'Космос' },
  { key: 'architecture', label: 'Архітектура' },
  { key: 'technology', label: 'Технології' },
  { key: 'ocean', label: 'Океан' },
  { key: 'mountains', label: 'Гори' },
  { key: 'art', label: 'Арт' },
  { key: 'cyberpunk', label: 'Кіберпанк' },
  { key: 'nature', label: 'Природа' },
  { key: 'cars', label: 'Авто' },
  { key: 'animals', label: 'Тварини' },
  { key: 'city', label: 'Місто' },
  { key: 'sport', label: 'Спорт' },
];

interface CategoryChipsProps {
  activeKeyword: string;
  onSelectKeyword: (keyword: string) => void;
  customKeywords?: string[];
  onRemoveCustomKeyword?: (keyword: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeKeyword,
  onSelectKeyword,
  customKeywords = [],
  onRemoveCustomKeyword,
}) => {
  const theme = useTheme();

  const allKeywords: KeywordItem[] = [
    ...customKeywords.map((tag) => ({
      key: tag.toLowerCase(),
      label: tag,
      isCustom: true,
    })),
    ...PRESET_KEYWORDS.filter(
      (preset) => !customKeywords.some((ck) => ck.toLowerCase() === preset.key.toLowerCase())
    ),
  ];

  return (
    <View style={styles.outerWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollWrapper}
        contentContainerStyle={styles.container}
      >
        {allKeywords.map((item) => {
          const isSelected = activeKeyword.toLowerCase() === item.key.toLowerCase();
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? '#007AFF' : theme.backgroundElement,
                  borderColor: isSelected ? '#007AFF' : 'transparent',
                },
              ]}
              onPress={() => onSelectKeyword(item.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#FFFFFF' : theme.text },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {item.isCustom && onRemoveCustomKeyword && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemoveCustomKeyword(item.key);
                  }}
                  style={styles.removeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text
                    style={[
                      styles.removeBtnText,
                      { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    height: 44,
    maxHeight: 44,
    minHeight: 44,
    flexGrow: 0,
    flexShrink: 0,
    marginVertical: 4,
  },
  scrollWrapper: {
    flex: 1,
    height: 44,
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    includeFontPadding: false,
  },
  removeBtn: {
    marginLeft: 6,
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
});
