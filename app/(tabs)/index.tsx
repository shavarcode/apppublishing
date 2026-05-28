              <View style={styles.btnRow}>
                <Ionicons name="camera" size={26} color={colors.primaryForeground} />
                <Text style={[styles.btnText, { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }]}>
                  Choose Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.pillsRow}>
            {["Whiteness", "Shade", "Alignment", "Gum Health", "Conditions"].map((p) => (
              <View key={p} style={[styles.pill, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.pillText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                  {p}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.disclaimerBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            This tool assists with visual dental assessment. It does not replace a clinical diagnosis. Always consult a licensed dentist.
          </Text>
        </View>

        {history.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
              Previous Scans
            </Text>
            {history.map((item) => {
              const uc = urgencyColor(item.urgency);
              const sc =
                item.overallScore >= 7 ? colors.scoreGood :
                item.overallScore >= 4 ? colors.scoreMid :
                colors.scoreLow;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.histRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push({ pathname: "/result", params: { scanId: item.id } })}
                  activeOpacity={0.75}
                >
                  <Image source={{ uri: item.imageUri }} style={styles.thumb} />
                  <View style={styles.histMid}>
                    <View style={styles.histColorRow}>
                      <View style={[styles.colorDot, { backgroundColor: item.colorHex }]} />
                      <Text style={[styles.histShade, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
                        {item.shadeGuide} Â· {item.colorDescription}
                      </Text>
                    </View>
                    <View style={[styles.urgencyTag, { backgroundColor: uc + "18" }]}>
                      <Text style={[styles.urgencyTagText, { color: uc, fontFamily: "Inter_500Medium" }]}>
                        {URGENCY_LABELS[item.urgency] ?? item.urgency}
                      </Text>
                    </View>
                    <Text style={[styles.histDate, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {new Date(item.timestamp).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <View style={[styles.scoreChip, { backgroundColor: sc + "18" }]}>
                    <Text style={[styles.scoreNum, { color: sc, fontFamily: "Inter_700Bold" }]}>
                      {item.overallScore}
                    </Text>
                    <Text style={[styles.scoreOf, { color: sc, fontFamily: "Inter_400Regular" }]}>/10</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {history.length === 0 && (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <MaterialCommunityIcons name="tooth-outline" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Your dental reports will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  appName: { fontSize: 22, letterSpacing: -0.5 },
  appSub: { fontSize: 12, marginTop: 1 },
  scanCard: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  tipBox: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  tipText: { fontSize: 13, lineHeight: 19, flex: 1 },
  scanBtn: { height: 60, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: "#2563EB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 5 },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnText: { fontSize: 17 },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillText: { fontSize: 12 },
  disclaimerBox: { flexDirection: "row", gap: 8, alignItems: "flex-start", padding: 12, borderRadius: 12, borderWidth: 1 },
  disclaimerText: { fontSize: 12, lineHeight: 17, flex: 1 },
  sectionTitle: { fontSize: 17, marginTop: 4 },
  histRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, overflow: "hidden", gap: 12, paddingRight: 14 },
  thumb: { width: 68, height: 68, backgroundColor: "#e0e0e0" },
  histMid: { flex: 1, gap: 4, paddingVertical: 10 },
  histColorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  colorDot: { width: 9, height: 9, borderRadius: 5 },
  histShade: { fontSize: 13 },
  urgencyTag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  urgencyTagText: { fontSize: 11 },
  histDate: { fontSize: 11 },
  scoreChip: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: "center" },
  scoreNum: { fontSize: 18 },
  scoreOf: { fontSize: 11 },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 36, gap: 10, borderRadius: 14, borderWidth: 1, borderStyle: "dashed", marginTop: 4 },
  emptyText: { fontSize: 14 },
});
