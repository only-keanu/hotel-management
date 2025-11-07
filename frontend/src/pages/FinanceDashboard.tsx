import React, { useState } from 'react'
import {
    DollarSignIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    CalendarIcon,
    DownloadIcon,
    FilterIcon,
    PlusIcon,
    XIcon,
    ArrowUpDownIcon,
} from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts'
interface Transaction {
    id: string
    date: string
    type: 'Income' | 'Expense'
    category: string
    description: string
    amount: number
    bookingId?: string
    guestName?: string
    roomNumber?: string
}
export function FinanceDashboard() {
    const [dateRange, setDateRange] = useState('This Month')
    const [filterType, setFilterType] = useState('All')
    const [showIncomeModal, setShowIncomeModal] = useState(false)
    const [showExpenseModal, setShowExpenseModal] = useState(false)
    const [roomFilter, setRoomFilter] = useState('All Rooms')
    const [categoryFilter, setCategoryFilter] = useState('All Categories')
    const [sortBy, setSortBy] = useState('date-desc')
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 'TXN001',
            date: '2024-11-15',
            type: 'Income',
            category: 'Room Booking',
            description: 'Deluxe Room - 3 nights',
            amount: 450,
            bookingId: 'BK-2024-156',
            guestName: 'John Smith',
            roomNumber: '101',
        },
        {
            id: 'TXN002',
            date: '2024-11-15',
            type: 'Expense',
            category: 'Supplies',
            description: 'Cleaning supplies restock',
            amount: 280,
        },
        {
            id: 'TXN003',
            date: '2024-11-14',
            type: 'Income',
            category: 'Room Booking',
            description: 'Standard Room - 2 nights',
            amount: 320,
            bookingId: 'BK-2024-155',
            guestName: 'Sarah Johnson',
            roomNumber: '205',
        },
        {
            id: 'TXN004',
            date: '2024-11-14',
            type: 'Income',
            category: 'Food & Beverage',
            description: 'Restaurant services',
            amount: 125,
            bookingId: 'BK-2024-155',
            guestName: 'Sarah Johnson',
        },
        {
            id: 'TXN005',
            date: '2024-11-13',
            type: 'Expense',
            category: 'Utilities',
            description: 'Electricity bill',
            amount: 850,
        },
        {
            id: 'TXN006',
            date: '2024-11-13',
            type: 'Income',
            category: 'Room Booking',
            description: 'Suite - 5 nights',
            amount: 950,
            bookingId: 'BK-2024-154',
            guestName: 'Michael Chen',
            roomNumber: '301',
        },
        {
            id: 'TXN007',
            date: '2024-11-12',
            type: 'Expense',
            category: 'Maintenance',
            description: 'HVAC system repair',
            amount: 450,
        },
        {
            id: 'TXN008',
            date: '2024-11-12',
            type: 'Income',
            category: 'Services',
            description: 'Spa services',
            amount: 200,
            bookingId: 'BK-2024-153',
            guestName: 'Emily Davis',
        },
    ])
    const rooms = ['All Rooms', '101', '102', '103', '201', '205', '301', '302']
    const expenseCategories = [
        'All Categories',
        'Supplies',
        'Utilities',
        'Maintenance',
        'Staff Salaries',
        'Marketing',
        'Insurance',
    ]
    const incomeCategories = [
        'Room Booking',
        'Food & Beverage',
        'Services',
        'Events',
        'Other',
    ]
    const handleAddIncome = (incomeData: any) => {
        const newIncome: Transaction = {
            id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
            date: incomeData.date,
            type: 'Income',
            category: incomeData.category,
            description: incomeData.description,
            amount: parseFloat(incomeData.amount),
            bookingId: incomeData.bookingId,
            guestName: incomeData.guestName,
            roomNumber: incomeData.roomNumber,
        }
        setTransactions([newIncome, ...transactions])
        setShowIncomeModal(false)
    }
    const handleAddExpense = (expenseData: any) => {
        const newExpense: Transaction = {
            id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
            date: expenseData.date,
            type: 'Expense',
            category: expenseData.category,
            description: expenseData.description,
            amount: parseFloat(expenseData.amount),
        }
        setTransactions([newExpense, ...transactions])
        setShowExpenseModal(false)
    }
    const filteredTransactions = transactions
        .filter((t) => {
            if (filterType === 'Income' && t.type !== 'Income') return false
            if (filterType === 'Expense' && t.type !== 'Expense') return false
            if (
                filterType === 'Income' &&
                roomFilter !== 'All Rooms' &&
                t.roomNumber !== roomFilter
            )
                return false
            if (
                filterType === 'Expense' &&
                categoryFilter !== 'All Categories' &&
                t.category !== categoryFilter
            )
                return false
            return true
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                case 'amount-desc':
                    return b.amount - a.amount
                case 'amount-asc':
                    return a.amount - b.amount
                default:
                    return 0
            }
        })
    const summaryCards = [
        {
            title: 'Total Revenue',
            amount: '$48,250',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSignIcon,
            color: 'green',
        },
        {
            title: 'Total Expenses',
            amount: '$18,420',
            change: '+8.2%',
            trend: 'up',
            icon: TrendingDownIcon,
            color: 'red',
        },
        {
            title: 'Net Profit',
            amount: '$29,830',
            change: '+15.3%',
            trend: 'up',
            icon: TrendingUpIcon,
            color: 'blue',
        },
        {
            title: 'Avg Booking Value',
            amount: '$285',
            change: '+5.7%',
            trend: 'up',
            icon: CalendarIcon,
            color: 'purple',
        },
    ]
    const chartData = [
        {
            month: 'Jan',
            revenue: 32000,
            expenses: 15000,
        },
        {
            month: 'Feb',
            revenue: 35000,
            expenses: 16000,
        },
        {
            month: 'Mar',
            revenue: 38000,
            expenses: 17000,
        },
        {
            month: 'Apr',
            revenue: 42000,
            expenses: 18000,
        },
        {
            month: 'May',
            revenue: 45000,
            expenses: 17500,
        },
        {
            month: 'Jun',
            revenue: 48250,
            expenses: 18420,
        },
    ]
    const categoryData = [
        {
            category: 'Room Bookings',
            amount: 38500,
        },
        {
            category: 'Food & Beverage',
            amount: 6200,
        },
        {
            category: 'Services',
            amount: 3550,
        },
        {
            category: 'Staff Salaries',
            amount: -12000,
        },
        {
            category: 'Supplies',
            amount: -3200,
        },
        {
            category: 'Utilities',
            amount: -3220,
        },
    ]
    const getCardColor = (color: string) => {
        switch (color) {
            case 'green':
                return 'bg-green-50 text-green-600'
            case 'red':
                return 'bg-red-50 text-red-600'
            case 'blue':
                return 'bg-blue-50 text-blue-600'
            case 'purple':
                return 'bg-purple-50 text-purple-600'
            default:
                return 'bg-gray-50 text-gray-600'
        }
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }
    return (
        <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Financial Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Track income, expenses, and financial performance
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowIncomeModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusIcon size={20} />
                            Add Income
                        </button>
                        <button
                            onClick={() => setShowExpenseModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusIcon size={20} />
                            Add Expense
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <DownloadIcon size={20} />
                            Export
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {summaryCards.map((card, index) => {
                        const Icon = card.icon
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${getCardColor(card.color)}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                    {card.change}
                  </span>
                                </div>
                                <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {card.amount}
                                </p>
                            </div>
                        )
                    })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Revenue vs Expenses
                            </h2>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Last 6 Months</option>
                                <option>This Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Revenue"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Expenses"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Income & Expense by Category
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="category"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Transactions
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            {['All', 'Income', 'Expense'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setFilterType(type)
                                        setRoomFilter('All Rooms')
                                        setCategoryFilter('All Categories')
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {type}
                                </button>
                            ))}
                            {filterType === 'Income' && (
                                <select
                                    value={roomFilter}
                                    onChange={(e) => setRoomFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {rooms.map((room) => (
                                        <option key={room} value={room}>
                                            {room}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {filterType === 'Expense' && (
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {expenseCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date-desc">Date (Newest)</option>
                                <option value="date-asc">Date (Oldest)</option>
                                <option value="amount-desc">Amount (High to Low)</option>
                                <option value="amount-asc">Amount (Low to High)</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Date
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Type
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Category
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Description
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Guest/Booking
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="py-4 px-4">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {transaction.type}
                      </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        {transaction.category}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {transaction.description}
                                        {transaction.roomNumber && (
                                            <span className="ml-2 text-xs text-blue-600">
                          Room {transaction.roomNumber}
                        </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {transaction.guestName ? (
                                            <div>
                                                <div className="text-sm text-gray-900">
                                                    {transaction.guestName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {transaction.bookingId}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td
                                        className={`py-4 px-4 text-right text-sm font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {transaction.type === 'Income' ? '+' : '-'}$
                                        {transaction.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showIncomeModal && (
                <IncomeModal
                    onClose={() => setShowIncomeModal(false)}
                    onSubmit={handleAddIncome}
                    categories={incomeCategories}
                    rooms={rooms.filter((r) => r !== 'All Rooms')}
                />
            )}
            {showExpenseModal && (
                <ExpenseModal
                    onClose={() => setShowExpenseModal(false)}
                    onSubmit={handleAddExpense}
                    categories={expenseCategories.filter((c) => c !== 'All Categories')}
                />
            )}
        </div>
    )
}
function IncomeModal({
                         onClose,
                         onSubmit,
                         categories,
                         rooms,
                     }: {
    onClose: () => void
    onSubmit: (data: any) => void
    categories: string[]
    rooms: string[]
}) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: categories[0],
        description: '',
        amount: '',
        guestName: '',
        bookingId: '',
        roomNumber: '',
    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Income</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Guest Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.guestName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    guestName: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter guest name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booking ID (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.bookingId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bookingId: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="BK-2024-XXX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Number (Optional)
                        </label>
                        <select
                            value={formData.roomNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    roomNumber: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select room</option>
                            {rooms.map((room) => (
                                <option key={room} value={room}>
                                    Room {room}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Income
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
function ExpenseModal({
                          onClose,
                          onSubmit,
                          categories,
                      }: {
    onClose: () => void
    onSubmit: (data: any) => void
    categories: string[]
}) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: categories[0],
        description: '',
        amount: '',
    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
