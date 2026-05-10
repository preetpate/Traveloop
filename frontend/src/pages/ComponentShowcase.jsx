import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ToastContainer from '../components/ui/ToastContainer';
import SkeletonCard from '../components/ui/SkeletonCard';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Sparkles } from 'lucide-react';

/**
 * Component Showcase Page
 * Demonstrates all design system base components with the light theme
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration: 3000 }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-text-primary">
              Traveloop Design System
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Premium light theme components with glassmorphism and smooth animations
          </p>
        </motion.div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Buttons</h2>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                  Variants
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                  Sizes
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                  States
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Static Card
              </h3>
              <p className="text-text-secondary text-sm">
                Glassmorphism card with backdrop blur and semi-transparent background
              </p>
            </Card>

            <Card className="p-6" onClick={() => alert('Card clicked!')}>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Clickable Card
              </h3>
              <p className="text-text-secondary text-sm">
                Interactive card with hover effects and keyboard support
              </p>
            </Card>

            <SkeletonCard />
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Badges</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              <Badge category="Sightseeing" />
              <Badge category="Food & Drink" />
              <Badge category="Adventure" />
              <Badge category="Culture" />
              <Badge category="Shopping" />
              <Badge category="Transport" />
              <Badge category="Accommodation" />
              <Badge category="Other" />
            </div>
          </Card>
        </section>

        {/* Progress Bars Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Progress Bars</h2>
          <Card className="p-6 space-y-6">
            <div>
              <p className="text-sm text-text-secondary mb-2">Default (Primary)</p>
              <ProgressBar value={65} showLabel />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Success</p>
              <ProgressBar value={100} color="bg-success" showLabel />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Danger</p>
              <ProgressBar value={25} color="bg-danger" showLabel />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Accent</p>
              <ProgressBar value={80} color="bg-accent" showLabel />
            </div>
          </Card>
        </section>

        {/* Modals & Dialogs Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Modals & Dialogs</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
            </div>
          </Card>
        </section>

        {/* Toasts Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Toast Notifications</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => addToast('Operation successful!', 'success')}>
                Success Toast
              </Button>
              <Button
                variant="danger"
                onClick={() => addToast('Something went wrong', 'error')}
              >
                Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => addToast('Here is some information', 'info')}
              >
                Info Toast
              </Button>
            </div>
          </Card>
        </section>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Color Palette</h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-20 bg-primary rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Primary</p>
                <p className="text-xs text-text-secondary">#2563EB</p>
              </div>
              <div>
                <div className="h-20 bg-accent rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Accent</p>
                <p className="text-xs text-text-secondary">#8B5CF6</p>
              </div>
              <div>
                <div className="h-20 bg-success rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Success</p>
                <p className="text-xs text-text-secondary">#10B981</p>
              </div>
              <div>
                <div className="h-20 bg-danger rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Danger</p>
                <p className="text-xs text-text-secondary">#EF4444</p>
              </div>
              <div>
                <div className="h-20 bg-background rounded-lg border border-border mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Background</p>
                <p className="text-xs text-text-secondary">#F8FAFC</p>
              </div>
              <div>
                <div className="h-20 bg-card rounded-lg border border-border mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Card</p>
                <p className="text-xs text-text-secondary">#FFFFFF</p>
              </div>
              <div>
                <div className="h-20 bg-secondary rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Secondary</p>
                <p className="text-xs text-text-secondary">#64748B</p>
              </div>
              <div>
                <div className="h-20 bg-warning rounded-lg mb-2"></div>
                <p className="text-sm font-medium text-text-primary">Warning</p>
                <p className="text-xs text-text-secondary">#F59E0B</p>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
        <div className="space-y-4">
          <p className="text-text-secondary">
            This is a portal-based modal with Framer Motion fade-in animation. It includes
            backdrop blur and can be closed by clicking outside, pressing Escape, or using the
            close button.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => alert('Confirmed!')}
        title="Delete Item?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
}
