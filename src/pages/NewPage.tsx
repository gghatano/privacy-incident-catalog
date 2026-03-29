import CaseForm from '../components/case-form/CaseForm'

export default function NewPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規事例の作成</h1>
      <CaseForm />
    </div>
  )
}
