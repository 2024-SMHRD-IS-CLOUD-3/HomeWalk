import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Container, Tabs, Tab, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppBarComponent from '../../components/AppBarComponent';
import DrawerComponent from '../../components/DrawerComponent';
import { useDrawer } from '../../context/DrawerContext';
import { fetchUsers, fetchDeactivationStatistics } from '../../api/api';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';

const AdminDashboard = () => {
  const { open, toggleDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [deactivationStats, setDeactivationStats] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 1) { // 회원 탈퇴 통계 탭이 선택되었을 때만 로드
      const loadDeactivationStats = async () => {
        try {
          const data = await fetchDeactivationStatistics();
          console.log('data', data);
          setDeactivationStats(data);
        } catch (error) {
          console.error('Failed to load deactivation statistics:', error);
        }
      };

      loadDeactivationStats();
    }
  }, [activeTab]);

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const columns = [
    { field: 'userId', headerName: 'User ID', width: 150 },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE'];

  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${deactivationStats[index].reasonText} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            관리자 대시보드
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
            <Tab icon={<GroupIcon />} label="회원 관리" />
            <Tab icon={<BarChartIcon />} label="회원 탈퇴 통계" />
          </Tabs>

          {activeTab === 0 ? (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  회원 관리
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    getRowId={(row) => row.userId}
                  />
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  회원 탈퇴 통계
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deactivationStats}
                        dataKey="count"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {deactivationStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
