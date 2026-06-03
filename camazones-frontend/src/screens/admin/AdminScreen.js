import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedBackdrop from '../../components/AnimatedBackdrop';
import { Button, Surface, Text } from '../../components/ui';
import { SectionHeader } from '../../components/MarketplaceCards';
import {
  blockAdminProduct,
  blockAdminShop,
  blockAdminUser,
  deleteAdminUser,
  fetchAdminDashboard,
  formatAdminMoney,
  unblockAdminProduct,
  unblockAdminShop,
  unblockAdminUser,
} from '../../services/adminService';
import { darkPalette, overlay, palette } from '../../theme';

const tabs = [
  { id: 'users', label: 'Clients' },
  { id: 'shops', label: 'Boutiques' },
  { id: 'products', label: 'Produits' },
  { id: 'commissions', label: 'Commissions' },
];

export default function AdminScreen({ appSettings }) {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('users');
  const [dashboard, setDashboard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;

  const isAdmin = user?.role === 'ADMIN';

  const loadDashboard = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAdminDashboard();
      setDashboard(data);
      setMessage('');
    } catch (error) {
      setDashboard(null);
      setMessage('API admin WAMP indisponible. Lance le backend pour afficher les donnees.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
    }
  }, [isAdmin]);

  const stats = useMemo(() => {
    const summary = dashboard?.summary ?? {};
    return [
      { label: 'Clients', value: dashboard?.users?.length ?? 0 },
      { label: 'Boutiques', value: dashboard?.shops?.length ?? 0 },
      { label: 'Produits', value: dashboard?.products?.length ?? 0 },
      { label: 'Commission semaine', value: formatAdminMoney(summary.totalCommission ?? 0) },
    ];
  }, [dashboard]);

  const toggle = async (type, item) => {
    const blocked = Boolean(item.blocked);
    const actions = {
      users: blocked ? unblockAdminUser : blockAdminUser,
      shops: blocked ? unblockAdminShop : blockAdminShop,
      products: blocked ? unblockAdminProduct : blockAdminProduct,
    };

    try {
      await actions[type](item.id);
      await loadDashboard();
    } catch (error) {
      setMessage('Action impossible: backend WAMP indisponible.');
    }
  };

  const deleteUser = (item) => {
    Alert.alert('Supprimer utilisateur', `Supprimer ${item.email} de la console admin ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAdminUser(item.id);
            await loadDashboard();
          } catch (error) {
            setMessage('Suppression impossible: backend WAMP indisponible.');
          }
        },
      },
    ]);
  };

  if (!isAdmin) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <AnimatedBackdrop colors={colors} darkMode={darkMode} />
        <View style={styles.content}>
          <SectionHeader title="Espace admin" description="Connecte-toi avec admin@camazones.demo pour ouvrir la console." />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AnimatedBackdrop colors={colors} darkMode={darkMode} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadDashboard} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>ADMIN</Text>
          <Text style={[styles.title, { color: colors.text }]}>Console Camazones</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Gestion clients, boutiques, produits bloques et commissions hebdomadaires.</Text>
        </View>

        {message ? (
          <Surface style={[styles.notice, { backgroundColor: darkMode ? palette.dark : overlay.orange, borderColor: line }]}>
            <Text style={[styles.noticeText, { color: colors.text }]}>{message}</Text>
          </Surface>
        ) : null}

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <Surface key={item.label} style={[styles.statCard, { backgroundColor: surface, borderColor: line }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>{item.label}</Text>
            </Surface>
          ))}
        </View>

        <View style={[styles.tabs, { backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} style={[styles.tab, active && { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabText, { color: active ? colors.background : colors.text }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'users' ? (
          <View style={styles.stack}>
            {dashboard?.users?.map((item) => (
              <AdminItem
                key={item.id}
                title={`${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || item.email}
                meta={`${item.email} · ${item.role}`}
                status={item.blocked ? 'Bloque' : item.verified ? 'Verifie' : 'Actif'}
                blocked={item.blocked}
                onToggle={() => toggle('users', item)}
                onDelete={() => deleteUser(item)}
                surface={surface}
                line={line}
                muted={muted}
                colors={colors}
              />
            ))}
          </View>
        ) : null}

        {activeTab === 'shops' ? (
          <View style={styles.stack}>
            {dashboard?.shops?.map((item) => (
              <AdminItem
                key={item.id}
                title={item.name}
                meta={`${item.city ?? 'Ville'} · ${item.subscriptionTier} · ${item.ownerEmail}`}
                status={item.blocked ? 'Bloquee' : item.verified ? 'AP' : 'Active'}
                blocked={item.blocked}
                onToggle={() => toggle('shops', item)}
                surface={surface}
                line={line}
                muted={muted}
                colors={colors}
              />
            ))}
          </View>
        ) : null}

        {activeTab === 'products' ? (
          <View style={styles.stack}>
            {dashboard?.products?.map((item) => (
              <AdminItem
                key={item.id}
                title={item.title}
                meta={`${item.category} · ${formatAdminMoney(item.price)} · ${item.sellerName}`}
                status={item.blocked ? 'Bloque' : item.status}
                blocked={item.blocked}
                onToggle={() => toggle('products', item)}
                surface={surface}
                line={line}
                muted={muted}
                colors={colors}
              />
            ))}
          </View>
        ) : null}

        {activeTab === 'commissions' ? (
          <View style={styles.stack}>
            <SectionHeader title="Commissions de la semaine" description={`${dashboard?.weeklyCommissions?.length ?? 0} operation(s) suivie(s).`} />
            {dashboard?.weeklyCommissions?.map((item) => (
              <Surface key={item.id} style={[styles.commissionCard, { backgroundColor: surface, borderColor: line }]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardCopy}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{item.orderReference}</Text>
                    <Text style={[styles.cardMeta, { color: muted }]}>{item.shopName} · {item.productTitle}</Text>
                    <Text style={[styles.cardMeta, { color: muted }]}>Vendeur: {item.sellerName}</Text>
                  </View>
                  <View style={styles.amountBlock}>
                    <Text style={[styles.amount, { color: colors.primary }]}>{formatAdminMoney(item.commissionAmount)}</Text>
                    <Text style={[styles.rate, { color: muted }]}>{Math.round(Number(item.commissionRate) * 1000) / 10}%</Text>
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function AdminItem({ title, meta, status, blocked, onToggle, onDelete, surface, line, muted, colors }) {
  return (
    <Surface style={[styles.itemCard, { backgroundColor: surface, borderColor: line }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardCopy}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.cardMeta, { color: muted }]}>{meta}</Text>
          <Text style={[styles.status, { color: blocked ? colors.orange : colors.green ?? palette.green }]}>{status}</Text>
        </View>
        <View style={styles.itemActions}>
          <Button
            mode={blocked ? 'outlined' : 'contained'}
            compact
            onPress={onToggle}
            buttonColor={blocked ? undefined : colors.primary}
            textColor={blocked ? colors.primary : colors.background}
          >
            {blocked ? 'Debloquer' : 'Bloquer'}
          </Button>
          {onDelete ? (
            <Button mode="outlined" compact onPress={onDelete} textColor={colors.orange ?? palette.orange}>
              Supprimer
            </Button>
          ) : null}
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 108,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  noticeText: {
    fontWeight: '800',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  statValue: {
    fontSize: 19,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    borderRadius: 18,
    padding: 6,
  },
  tab: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '900',
  },
  stack: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  commissionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardMeta: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    fontWeight: '900',
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  amount: {
    fontSize: 15,
    fontWeight: '900',
  },
  rate: {
    fontSize: 12,
    fontWeight: '800',
  },
});
