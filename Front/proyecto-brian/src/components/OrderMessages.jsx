// src/components/OrderMessages.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  getOrderMessagesByOrderId,
  createOrderMessage,
  markMessagesAsRead
} from "../services/orderService";
import { UserContext } from "../context/UserContext";
import "../styles/OrderMessages.css";

export default function OrderMessages({ orderId, onClose, onUnreadCountChange, isOpen }) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!orderId || !isOpen) return;
    setLoading(true);
    try {
      const data = await getOrderMessagesByOrderId(orderId) || [];

      // Calcular NO leídos ANTES de marcar como leídos en backend
      const unread = data.filter(m => {
        const sentByMe = m.senderId === Number(user.id);
        if (sentByMe) return false;
        return user.rol === "Admin" ? !m.leidoPorAdmin : !m.leidoPorUser;
      }).length;

      if (onUnreadCountChange) onUnreadCountChange(orderId, unread);

      // Actualizo UI con los mensajes traídos
      setMessages(data);

      // Marcar como leídos en backend (según rol)
      await markMessagesAsRead(orderId);

      // Después, sincronizo localmente para reflejar que ahora están leídos
      const updated = data.map(m => ({
        ...m,
        leidoPorAdmin: user.rol === "Admin" ? true : m.leidoPorAdmin,
        leidoPorUser: user.rol === "User" ? true : m.leidoPorUser
      }));

      setMessages(updated);

      // Scroll al final
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
      }, 50);

    } catch (err) {
      console.error("Error al obtener/marcar mensajes:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await createOrderMessage({
        orderId,
        message: newMessage,
        senderId: Number(user.id),
        senderRole: user.rol === "Admin" ? "Admin" : "User",
      });

      // optimista: reconstruyo la lista localmente y la marco leída para el remitente
      const optimistic = {
        id: Math.random() * -1, // id temporal negativo hasta que venga del backend
        orderId,
        message: newMessage,
        senderRole: user.rol === "Admin" ? "Admin" : "User",
        senderId: Number(user.id),
        fechaHoraMessage: new Date().toISOString(),
        leidoPorAdmin: user.rol === "Admin" ? true : false,
        leidoPorUser: user.rol === "User" ? true : false,
        habilitado: true
      };
      setMessages(prev => [...prev, optimistic]);
      setNewMessage("");

      // refresco desde backend para obtener id real y estado
      await fetchMessages();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="order-messages-overlay" onClick={onClose}></div>
      <div className="order-messages-panel open" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h4>Mensajes</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="drawer-content" ref={messagesEndRef}>
          {loading ? (
            <p>Cargando...</p>
          ) : messages.length === 0 ? (
            <p>No hay mensajes.</p>
          ) : (
            messages.map(m => {
              const sentByMe = m.senderId === Number(user.id);
              const read = user.rol === "Admin" ? m.leidoPorAdmin : m.leidoPorUser;

              return (
                <div
                  key={m.id}
                  className={`message-item ${sentByMe ? "sent" : "received"} ${read ? "read" : "unread"}`}
                >
                  <p>{m.message}</p>
                  <small>
                    {new Date(m.fechaHoraMessage).toLocaleString()} • <strong>{m.senderRole}</strong>
                  </small>
                </div>
              );
            })
          )}
        </div>

        <div className="drawer-footer">
          <input
            type="text"
            placeholder="Escribir mensaje..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
          />
          <button className="btn send" onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </>
  );
}