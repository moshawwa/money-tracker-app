import React from "react";
import { Menu, Plus, ChevronDown } from "lucide-react";

interface HeaderProps {
  onNewTransaction: () => void;
  isFormOpen: boolean; // Add isFormOpen to the props
}

const Header: React.FC<HeaderProps> = ({ onNewTransaction, isFormOpen }) => {
  return (
    <header className="bg-white border-bottom sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-2">
          <Menu className="d-sm-none" size={24} />
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "32px", height: "32px" }}
            >
              <span className="text-white fw-bold">$</span>
            </div>
            <h1 className="fs-4 fw-semibold m-0 d-none d-sm-block">
              <span className="text-primary">Money</span>Tracker
            </h1>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={onNewTransaction}
            className="btn btn-primary d-flex align-items-center gap-1 rounded-pill"
            style={{ transition: "transform 0.2s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            disabled={isFormOpen} // Disable the button when the form is open
          >
            <Plus size={16} /> {isFormOpen ? "Form Open" : "New"}
          </button>

          <div className="d-flex align-items-center gap-1">
            <div
              className="border rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
            >
              <span className="text-secondary">U</span>
            </div>
            <ChevronDown size={16} className="text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
