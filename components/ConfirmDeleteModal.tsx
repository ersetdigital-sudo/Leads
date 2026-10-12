"use client";

import { Modal } from "./Modal";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";

export function ConfirmDeleteModal() {
  const { deletingLead, closeConfirm, confirmDelete } = useStore();

  return (
    <Modal id="confirm-modal" open={!!deletingLead} role="alertdialog" onClose={closeConfirm}>
      <div className="modal__box modal__box--sm">
        <div className="modal__body" style={{ paddingTop: 26 }}>
          <div className="confirm-icon">
            <Icon name="trash" />
          </div>
          <h3 className="modal__title" style={{ marginBottom: 8 }}>
            Hapus lead ini?
          </h3>
          <p className="confirm-text">
            Lead <b>{deletingLead?.nama}</b> akan dihapus permanen dan tidak bisa dikembalikan.
          </p>
        </div>
        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={closeConfirm}>
            Batal
          </button>
          <button type="button" className="btn btn--danger" onClick={confirmDelete}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
