import DashboardLayout from '@/components/layout/DashboardLayout'
import CategoryManager from '@/components/categories/CategoryManager'

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryManager />
    </DashboardLayout>
  )
}