import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SkeletonRows } from '../components/ui/Skeleton.jsx'
import { useUsers, useInviteUser, useSetUserActive } from '../hooks/useUsers.js'
import { cn } from '../lib/cn.js'

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('That email looks off'),
  role: z.enum(['Admin', 'Engineer']),
})

export default function Admin() {
  const { data: users = [], isLoading } = useUsers()
  const invite = useInviteUser()
  const setActive = useSetUserActive()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [confirmOff, setConfirmOff] = useState(null) // user pending deactivation

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', role: 'Engineer' },
  })

  const onInvite = (values) => {
    invite.mutate(values, {
      onSuccess: () => {
        toast.success('Invite sent ✉️')
        reset()
        setInviteOpen(false)
      },
    })
  }

  const toggle = (user) => {
    if (user.active) {
      setConfirmOff(user) // deactivating — confirm first
    } else {
      setActive.mutate({ userId: user.id, active: true })
      toast.success(`${user.name} is back in 👍`)
    }
  }

  const confirmDeactivate = () => {
    setActive.mutate({ userId: confirmOff.id, active: false })
    toast(`${confirmOff.name} deactivated`)
    setConfirmOff(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Admin</h1>
          <p className="mt-1 text-sm text-ink/55">Who's on the team and what they can do.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus size={16} /> Invite user
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-5"><SkeletonRows rows={5} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#e3eaf4] text-left text-xs font-bold uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 text-right">Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="animate-fade-in border-b border-[#f3f7fb] last:border-0" style={{ animationDelay: `${i * 25}ms` }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                        <span className="font-bold text-ink">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-ink/60">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold',
                        u.role === 'Admin' ? 'bg-blue-tint text-blue' : 'bg-gray-100 text-ink/60',
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <Switch checked={u.active} onChange={() => toggle(u)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* invite modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a teammate"
        subtitle="They'll get an email to join M.C. DEAN Optimus."
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onInvite)} disabled={invite.isPending}>
              <Mail size={15} /> {invite.isPending ? 'Sending…' : 'Send invite'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
          <Field label="Full name" error={errors.name?.message}>
            <input {...register('name')} placeholder="Jordan Pierce" className={inputCls} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register('email')} placeholder="jordan.pierce@mcdean.com" className={inputCls} />
          </Field>
          <Field label="Role" error={errors.role?.message}>
            <select {...register('role')} className={inputCls}>
              <option value="Engineer">Engineer</option>
              <option value="Admin">Admin</option>
            </select>
          </Field>
        </form>
      </Modal>

      {/* deactivate confirm */}
      <Modal
        open={!!confirmOff}
        onClose={() => setConfirmOff(null)}
        title="Deactivate this user?"
        subtitle={confirmOff ? `${confirmOff.name} will lose access until you switch them back on.` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOff(null)}>Keep active</Button>
            <Button variant="danger" onClick={confirmDeactivate}>Deactivate</Button>
          </>
        }
      >
        <p className="text-sm text-ink/55">Nothing they've already run gets deleted.</p>
      </Modal>
    </div>
  )
}

const inputCls =
  'h-11 w-full rounded-xl border border-[#dce5f1] bg-white px-3.5 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/45">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'press relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-blue' : 'bg-gray-300',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
          checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}
