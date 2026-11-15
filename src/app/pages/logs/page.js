"use client";

import styles from './page.module.css';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Header from '@/components/ui/Header/Header';
import { useState } from 'react';
import CustomTable from '@/components/ui/Table/Table';
import { useLogs } from '@/features/logs/hooks/useLogs';
import { getLogUserName, InjectLogsTable } from '@/utils/dataInject';

export default function Logs() {

    const { data, isLoading } = useLogs();
    const logs = Array.isArray(data) ? data : [];
    const columns = InjectLogsTable();

    const users = Array.from(new Set(logs.map(getLogUserName))).sort();
    const [filters, setFilters] = useState({
        selectedUsers: [],
        startDate: "",
        endDate: "",
    });

    const filteredData = logs
      .filter((item) => {
        if (
          filters.selectedUsers.length &&
          !filters.selectedUsers.includes(getLogUserName(item))
        ) {
          return false;
        }

        if (!filters.startDate && !filters.endDate) {
          return true;
        }

        const itemDate = new Date(item.dataHora);
        if (!item.dataHora || Number.isNaN(itemDate.getTime())) return false;

        if (filters.startDate) {
          const start = new Date(filters.startDate);
          if (itemDate < start) return false;
        }

        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) return false;
        }

        return true;
      });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    return (
        <div className={styles.body}>
            <Sidebar />
            <div className={styles.main}>

                <Header 
                    titulo="Logs do Sistema"
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    users={users}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
                
                <CustomTable 
                    columns={columns}
                    headerAs = "span"
                    rowsPerPage={10}
                    data={filteredData}
                    searchValue={debouncedSearch}
                    searchKeys={["username", "nomeContaAdm", "acaoRealizada", "tabelaAlterada"]}
                    rowKey="idLog"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}