"use client";

import { useEffect, useRef, useState } from "react";
import { FunnelFill } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import Dropdown from "../../Dropdown/Dropdown";
import styles from "../Header.module.css";

export default function Filtro({
  users = [],
  types = [],
  userLabel = "Selecionar usuários",
  filters = {},
  onFiltersChange,
}) {
  const [open, setOpen] = useState(false);
  const [localSelectedUsers, setLocalSelectedUsers] = useState(filters.selectedUsers || []);
  const [localSelectedTypes, setLocalSelectedTypes] = useState(filters.selectedTypes || []);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const toggleOpen = () => {
    setOpen((current) => !current);
  };

  const handleUsersChange = (event) => {
    const nextUser = event.target.value;
    if (!nextUser) return;

    setLocalSelectedUsers((current) =>
      current.includes(nextUser) ? current : [...current, nextUser]
    );

    event.target.value = "";
  };

  const handleTypesChange = (event) => {
    const nextType = event.target.value;
    if (!nextType) return;

    setLocalSelectedTypes((current) =>
      current.includes(nextType) ? current : [...current, nextType]
    );

    event.target.value = "";
  };

  const readDateInputs = () => {
    const inputs = wrapperRef.current?.querySelectorAll("input[type='date']") || [];
    return {
      startDate: inputs[0]?.value || "",
      endDate: inputs[1]?.value || "",
    };
  };

  const handleApply = () => {
    const { startDate, endDate } = readDateInputs();
    onFiltersChange?.({
      ...filters,
      selectedUsers: localSelectedUsers,
      selectedTypes: localSelectedTypes,
      startDate,
      endDate,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setLocalSelectedUsers([]);
    setLocalSelectedTypes([]);
    onFiltersChange?.({
      ...filters,
      selectedUsers: [],
      selectedTypes: [],
      startDate: "",
      endDate: "",
    });
  };

  const userOptions = users.map((user) => ({ value: user, label : user }));
  const typeOptions = types.map((type) => ({ value: type, label: type }));
  return (
    <div className={styles.filterWrapper} ref={wrapperRef}>
      <Button
        variant="highlight"
        className={`d-flex align-items-center gap-2 border ${styles.filtroButton}`}
        onClick={toggleOpen}
      >
        <FunnelFill />
        Filtro
      </Button>

      {open && (
        <div className={styles.filterPanel}>
          <div className={styles.filterPanelHeader}>
            <span>Filtrar por</span>
          </div>

          <div className={styles.filterPanelField}>
            <Input
              type="date"
              Label="Período inicial"
              placeholder=""
              inputClassName=""
              defaultValue={filters.startDate}
              key={`start-${filters.startDate}`}
            />

            <Input
              type="date"
              Label="Período final"
              placeholder=""
              inputClassName=""
              defaultValue={filters.endDate}
              key={`end-${filters.endDate}`}
            />

            <Dropdown
              options={[ ...userOptions ]}
              value=""
              Label={userLabel}
              onChange={handleUsersChange}
              placeholder="Adicionar"
              inputClassName=""
              variant="Default"
            />
            {types.length > 0 && (
              <Dropdown
                options={typeOptions}
                value=""
                Label="Selecionar tipos de aviso"
                onChange={handleTypesChange}
                placeholder="Adicionar tipo"
                inputClassName=""
                variant="Default"
              />
            )}
            {localSelectedUsers.length > 0 && (
              <div className={styles.selectedUsersList}>
                {localSelectedUsers.map((user) => (
                  <span key={user} className={styles.selectedUserItem}>
                    {user}
                  </span>
                ))}
              </div>
            )}
            {types.length > 0 && localSelectedTypes.length > 0 && (
              <div className={styles.selectedUsersList}>
                {localSelectedTypes.map((type) => (
                  <span key={type} className={styles.selectedUserItem}>
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
           
          <div className={styles.filterPanelActions}>
            <Button variant="secondary" onClick={handleClear}>
              Limpar
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
