"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image } from "react-bootstrap";

import styles from "./ProfileUser.module.css";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { useCascade } from "@/hooks/useCascade";

export default function ProfileUser({
    show,
    onHide,
    title,
    fields = [],
    initialData = {},
    showPhoto = true,
    onSaveChanges,
    submitLabel = "Salvar",
}) {


    const { formData, setFormData, handleChange, getFieldOptions, isFieldLocked } = useCascade(fields, initialData, show);

    const [photoPreview, setPhotoPreview] = useState(null);
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (show) {
            setFormData(initialData || {});
            setPhotoPreview(initialData?.fotoPerfil);
            setErro("");
        }
    }, [show, initialData]);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (photoPreview && photoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhotoPreview(URL.createObjectURL(file));
        setFoto(file);
    };

    const handleSubmit = async () => {
        setErro("");
        setLoading(true);
        try {
            await onSaveChanges?.({ ...formData, foto });
        } catch (err) {
            setErro(err.message || "Erro ao salvar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Offcanvas
            show={show}
            onHide={onHide}
            placement="end"
            scroll={false}
            backdrop={false}
            className={styles.offcanvas}
        >
            <Offcanvas.Header closeButton className={styles.header}>
                <div style={{ width: "100%" }}>
                    <Offcanvas.Title className={styles.title}>{title}</Offcanvas.Title>
                    <div className={styles.titleUnderline} />
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className={styles.body}>
                <div className={styles.content}>

                    <Form className={styles.form}>
                        {fields.map((field) => (
                            <Form.Group key={field.name} className="mb-3">


                                {field.type === "select" ? (
                                    <>
                                        <Dropdown
                                            name={field.name}
                                            value={formData[field.name] ?? ""}
                                            onChange={handleChange(field.name)}
                                            className={styles.input}
                                            options={getFieldOptions(field)}
                                            isDisabled={isFieldLocked(field)}
                                            placeholder={
                                                isFieldLocked(field)
                                                    ? "Selecione o campo anterior primeiro"
                                                    : field.placeholder
                                            }
                                            Label={field.label}
                                        >

                                        </Dropdown>
                                    </>
                                ) : (
                                    <Input
                                        type={field.type || "text"}
                                        name={field.name}
                                        Label={field.label}
                                        placeholder={field.placeholder}
                                        value={formData[field.name] ?? ""}
                                        onChange={handleChange(field.name, field.mask)}
                                        className={styles.input}
                                    />
                                )}
                            </Form.Group>
                        ))}

                        
                        <Button
                            variant="primary"
                            className={styles.submitButton}
                            style={{ width: "100%", marginTop: "16px" }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="critical"
                            className={styles.submitButton}
                            style={{ width: "100%", marginTop: "16px" }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Excluir conta
                        </Button>
                        
                    </Form>

                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
