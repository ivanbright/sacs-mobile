import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LIME = '#c8f135';
const DARK = '#1e1e2e';
const BG = '#f3f4f8';
const WHITE = '#ffffff';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';
const ERROR = '#ef4444';
const ICON_W = 52;

type FieldKey = keyof typeof EMPTY_FORM;

interface FieldDef {
  key: FieldKey;
  label: string;
  placeholder: string;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
  autoCorrect?: boolean;
  spellCheck?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  textContentType?: React.ComponentProps<typeof TextInput>['textContentType'];
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
}

interface Section {
  title: string;
  subtitle: string;
  icon: string;
  fields: FieldDef[];
}

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  website: '',
  quantity: '',
  budget: '',
  password: '',
  pin: '',
  otp: '',
  promoCode: '',
  rawIdentifier: '',
  notes: '',
};

const SECTIONS: Section[] = [
  {
    title: 'Personal Info',
    subtitle: 'Tell us who you are',
    icon: '👤',
    fields: [
      {
        key: 'fullName',
        label: 'Full name',
        placeholder: 'Jane Doe',
        autoCapitalize: 'words',
      },
      {
        key: 'email',
        label: 'Email address',
        placeholder: 'jane@company.com',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
        textContentType: 'emailAddress',
        autoComplete: 'email',
      },
      {
        key: 'phone',
        label: 'Phone number',
        placeholder: '+1 (555) 000-0000',
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        autoComplete: 'tel',
      },
      {
        key: 'website',
        label: 'Website',
        placeholder: 'https://company.com',
        keyboardType: 'url',
        autoCapitalize: 'none',
        autoCorrect: false,
      },
    ],
  },
  {
    title: 'Financials',
    subtitle: 'Numbers & amounts',
    icon: '💰',
    fields: [
      {
        key: 'quantity',
        label: 'Quantity',
        placeholder: '42',
        keyboardType: 'number-pad',
      },
      {
        key: 'budget',
        label: 'Budget',
        placeholder: '1499.99',
        keyboardType: 'decimal-pad',
      },
    ],
  },
  {
    title: 'Security',
    subtitle: 'Credentials & verification',
    icon: '🔒',
    fields: [
      {
        key: 'password',
        label: 'Password',
        placeholder: 'At least 6 characters',
        secureTextEntry: true,
        autoCapitalize: 'none',
        autoCorrect: false,
        textContentType: 'newPassword',
        autoComplete: 'password-new',
      },
      {
        key: 'pin',
        label: 'PIN',
        placeholder: '••••',
        secureTextEntry: true,
        keyboardType: 'number-pad',
        maxLength: 6,
      },
      {
        key: 'otp',
        label: 'One-time code',
        placeholder: '000000',
        keyboardType: 'number-pad',
        textContentType: 'oneTimeCode',
        autoComplete: 'sms-otp',
        maxLength: 6,
      },
    ],
  },
  {
    title: 'Extras',
    subtitle: 'Additional details',
    icon: '✏️',
    fields: [
      {
        key: 'promoCode',
        label: 'Promo code',
        placeholder: 'MAKRO2026',
        autoCapitalize: 'characters',
      },
      {
        key: 'rawIdentifier',
        label: 'Identifier',
        placeholder: 'raw_db_key',
        autoCapitalize: 'none',
        autoCorrect: false,
        spellCheck: false,
      },
      {
        key: 'notes',
        label: 'Notes',
        placeholder: 'Anything else you want to share…',
        multiline: true,
        numberOfLines: 4,
        autoCapitalize: 'sentences',
      },
    ],
  },
];

function FillButton({
  label,
  onPress,
  compact = false,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  const fill = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  const sweep = useCallback(
    (to: number) =>
      Animated.timing(fill, { toValue: to, duration: 380, useNativeDriver: false }).start(),
    [fill],
  );

  const fillWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [ICON_W, width > 0 ? width : ICON_W],
  });

  const hoverProps =
    Platform.OS === 'web'
      ? ({ onMouseEnter: () => sweep(1), onMouseLeave: () => sweep(0) } as object)
      : {};

  return (
    <TouchableOpacity
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onPressIn={() => sweep(1)}
      onPressOut={() => sweep(0)}
      onPress={onPress}
      activeOpacity={1}
      style={[btn.root, compact && { alignSelf: 'flex-start' }]}
      {...hoverProps}
    >
      <Animated.View style={[btn.fill, { width: fillWidth }]} />
      <View style={btn.iconBox}>
        <Text style={btn.arrow}>→</Text>
      </View>
      <Text style={btn.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: ICON_W,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LIME,
  },
  iconBox: {
    width: ICON_W,
    height: ICON_W,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
    zIndex: 1,
    paddingRight: ICON_W,
  },
});

export default function MakroForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function update(key: FieldKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    console.log('Form payload:', JSON.stringify(form, null, 2));
    Alert.alert('Submitted ✓', JSON.stringify(form, null, 2));
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <Text style={s.headline}>
              Get started{'\n'}
              <Text style={s.highlight}> for free </Text>
            </Text>
            <Text style={s.subheadline}>Fill in the form below. No contracts, no hidden fees.</Text>
          </View>

          {SECTIONS.map((section) => (
            <View key={section.title} style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.iconWrap}>
                  <Text style={s.icon}>{section.icon}</Text>
                </View>
                <View>
                  <Text style={s.cardTitle}>{section.title}</Text>
                  <Text style={s.cardSubtitle}>{section.subtitle}</Text>
                </View>
              </View>

              <View style={s.divider} />

              {section.fields.map((field) => {
                const isFocused = focused === field.key;
                const hasError = !!errors[field.key];

                return (
                  <View key={field.key} style={s.fieldWrap}>
                    <Text style={s.label}>{field.label}</Text>
                    <TextInput
                      style={[
                        s.input,
                        field.multiline && s.inputMultiline,
                        isFocused && s.inputFocused,
                        hasError && s.inputError,
                      ]}
                      placeholder={field.placeholder}
                      placeholderTextColor="#adb5bd"
                      value={form[field.key]}
                      onChangeText={(t) => update(field.key, t)}
                      onFocus={() => setFocused(field.key)}
                      onBlur={() => setFocused(null)}
                      keyboardType={field.keyboardType ?? 'default'}
                      autoCapitalize={field.autoCapitalize ?? 'sentences'}
                      autoCorrect={field.autoCorrect ?? true}
                      spellCheck={field.spellCheck}
                      secureTextEntry={field.secureTextEntry}
                      multiline={field.multiline}
                      numberOfLines={field.numberOfLines}
                      blurOnSubmit={!field.multiline}
                      textAlignVertical={field.multiline ? 'top' : 'center'}
                      maxLength={field.maxLength}
                      textContentType={field.textContentType}
                      autoComplete={field.autoComplete}
                    />
                    {hasError && <Text style={s.errorText}>{errors[field.key]}</Text>}
                  </View>
                );
              })}
            </View>
          ))}

          <FillButton label="Submit form" onPress={handleSubmit} />

          <TouchableOpacity style={s.resetBtn} onPress={handleReset} activeOpacity={0.7}>
            <Text style={s.resetText}>Reset all fields</Text>
          </TouchableOpacity>

          <View style={s.enterprise}>
            <View style={s.entBadge}>
              <Text style={s.entBadgeText}>⊞  Enterprise plans</Text>
            </View>
            <Text style={s.entTitle}>Need a custom plan?</Text>
            <Text style={s.entDesc}>
              High volumes, multiple entities, or custom integrations? Our team can tailor Makro to
              your needs.
            </Text>
            <FillButton
              label="Contact sales"
              onPress={() => Alert.alert('Enterprise', 'Our team will reach out shortly.')}
              compact
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  highlight: {
    backgroundColor: LIME,
    borderRadius: 6,
    overflow: 'hidden',
    fontStyle: 'italic',
  },
  subheadline: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  input: {
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 48,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputFocused: {
    borderColor: DARK,
    backgroundColor: WHITE,
    shadowColor: DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: ERROR,
    backgroundColor: '#fff5f5',
  },
  errorText: {
    fontSize: 11,
    color: ERROR,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 2,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  resetText: {
    fontSize: 13,
    color: MUTED,
    fontWeight: '500',
  },
  enterprise: {
    backgroundColor: '#e8eaf0',
    borderRadius: 18,
    padding: 22,
  },
  entBadge: {
    alignSelf: 'flex-start',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  entBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  entTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  entDesc: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 18,
  },
});
