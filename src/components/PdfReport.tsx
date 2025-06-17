import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register custom fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeAmODA.woff2', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#fafafa',
    color: '#1f2937',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #e5e7eb',
  },
  
  headerLeft: {
    flex: 1,
  },
  
  headerRight: {
    alignItems: 'flex-end',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#0f766e',
    marginBottom: 5,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#374151',
  },
  
  contentText: {
    fontSize: 12,
    lineHeight: 1.7,
    color: '#4b5563',
    textAlign: 'justify',
  },
  
  symptomsList: {
    marginTop: 8,
  },
  
  symptomItem: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#4b5563',
    marginBottom: 6,
    paddingLeft: 12,
  },
  
  warningSection: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  warningIcon: {
    fontSize: 16,
    color: '#d97706',
    marginRight: 8,
  },
  
  warningTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#92400e',
  },
  
  warningText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#78350f',
  },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTop: '1px solid #e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#9ca3af',
  },
  
  badge: {
    backgroundColor: '#dcfdf7',
    color: '#0f766e',
    fontSize: 10,
    padding: '4 8',
    borderRadius: 12,
    fontWeight: 600,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
});

interface PdfReportProps {
  symptoms: string;
  suggestion: string;
  patientName?: string;
  reportId?: string;
}

export const PdfReport = ({ 
  symptoms, 
  suggestion, 
  patientName = "Patient",
  reportId 
}: PdfReportProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formatSymptoms = (symptomsText: string) => {
    // Split symptoms by common delimiters and clean up
    const symptomList = symptomsText
      .split(/[,;.\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return symptomList.length > 1 ? symptomList : [symptomsText];
  };

  const formattedSymptoms = formatSymptoms(symptoms);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>🩺 AI Health Assessment</Text>
            <Text style={styles.subtitle}>Powered by Aidvise Intelligence</Text>
            <Text style={styles.badge}>AI-Generated Report</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.subtitle}>Report Date</Text>
            <Text style={styles.timestamp}>{currentDate}</Text>
            {reportId && (
              <>
                <Text style={styles.subtitle}>Report ID</Text>
                <Text style={styles.timestamp}>{reportId}</Text>
              </>
            )}
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <Text style={styles.contentText}>Name: {patientName}</Text>
          <Text style={styles.contentText}>Assessment Date: {currentDate}</Text>
        </View>

        {/* Reported Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionTitle}>Reported Symptoms</Text>
          </View>
          {formattedSymptoms.length > 1 ? (
            <View style={styles.symptomsList}>
              {formattedSymptoms.map((symptom, index) => (
                <Text key={index} style={styles.symptomItem}>
                  • {symptom}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.contentText}>{symptoms}</Text>
          )}
        </View>

        {/* AI Analysis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🤖</Text>
            <Text style={styles.sectionTitle}>AI Health Assessment</Text>
          </View>
          <Text style={styles.contentText}>{suggestion}</Text>
        </View>

        {/* Important Disclaimer */}
        <View style={styles.warningSection}>
          <View style={styles.warningHeader}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>Important Medical Disclaimer</Text>
          </View>
          <Text style={styles.warningText}>
            This AI-generated assessment is for informational purposes only and should not be considered as professional medical advice, diagnosis, or treatment. 
            Always consult with a qualified healthcare professional for proper medical evaluation and care. In case of emergency, contact emergency services immediately.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Aidvise AI Health Assistant</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};