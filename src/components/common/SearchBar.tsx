import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'Введіть ключове слово...',
  onSearch,
  isLoading = false,
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [text, setText] = useState(value);
  const theme = useTheme();

  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  const handleClear = () => {
    setText('');
    onSearch('');
  };

  const handleSubmit = () => {
    onSearch(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color="#007AFF" style={styles.actionBtn} />
      ) : text.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.clearBtnText, { color: theme.textSecondary }]}>×</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.searchButton, { backgroundColor: '#007AFF' }]}
        activeOpacity={0.8}
      >
        <Text style={styles.searchBtnText}>Пошук</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 6,
    height: 48,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    paddingVertical: 0,
  },
  actionBtn: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  searchButton: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
