import express from "express"
import {
  getNotificacionesByUsuario,
  marcarComoLeida,
  marcarTodasComoLeidas,
  getConteoNoLeidas,
  eliminarNotificacion,
} from "../controllers/NotificacionController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /notificaciones/usuario/{usuario_id}:
 *   get:
 *     summary: Get notifications by user
 *     description: Retrieve all notifications for a specific user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: leida
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getNotificacionesByUsuario)

/**
 * @swagger
 * /notificaciones/usuario/{usuario_id}/conteo-no-leidas:
 *   get:
 *     summary: Get unread notifications count
 *     description: Get count of unread notifications for a user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unread notifications count
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id/conteo-no-leidas", protect, getConteoNoLeidas)

/**
 * @swagger
 * /notificaciones/{id}/marcar-leida:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/marcar-leida", protect, marcarComoLeida)

/**
 * @swagger
 * /notificaciones/usuario/{usuario_id}/marcar-todas-leidas:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Mark all notifications for a user as read
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.put("/usuario/:usuario_id/marcar-todas-leidas", protect, marcarTodasComoLeidas)

/**
 * @swagger
 * /notificaciones/{id}:
 *   delete:
 *     summary: Delete notification
 *     description: Delete a specific notification
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, eliminarNotificacion)

export default router
