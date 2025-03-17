import { useState, useEffect, useRef } from "react";
import { TransactionProvider } from "../context/TransactionContext";
import Header from "../components/Header";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseChart from "../components/ExpenseChart";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { Modal } from "bootstrap"; // Import Bootstrap's Modal class

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const modalRef = useRef<Modal | null>(null);
  const modalElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize the Bootstrap modal when the component mounts
    if (modalElementRef.current) {
      modalRef.current = new Modal(modalElementRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }

    // Cleanup the modal when the component unmounts
    return () => {
      if (modalRef.current) {
        modalRef.current.dispose();
      }
    };
  }, []);

  const openForm = () => {
    if (modalRef.current) {
      modalRef.current.show();
      setIsFormOpen(true);
    }
  };

  const closeForm = () => {
    if (modalRef.current) {
      modalRef.current.hide();
      setIsFormOpen(false);
    }
  };

  return (
    <TransactionProvider>
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Header onNewTransaction={openForm} isFormOpen={false} />

        <main className="flex-grow-1 container py-4">
          <div className="mb-4">
            <BalanceSummary />
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <ExpenseChart />
            </div>
            <div className="col-12 col-lg-6">
              <TransactionList />
            </div>
          </div>
        </main>

        {/* Bootstrap Modal */}
        <div
          ref={modalElementRef}
          className="modal fade"
          id="transactionModal"
          tabIndex={-1}
          aria-labelledby="transactionModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <TransactionForm onClose={closeForm} />
            </div>
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
};

export default Index;
