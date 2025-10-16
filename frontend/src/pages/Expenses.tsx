import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { mockExpenses } from '../utils/mockData';
import { Expense } from '../utils/types';
import { PlusIcon, SearchIcon, DollarSignIcon, FilterIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  // Get unique categories
  const categories = ['all', ...new Set(mockExpenses.map(expense => expense.category))];
  // Filter expenses
  const filteredExpenses = mockExpenses.filter(expense => (expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || expense.category.toLowerCase().includes(searchTerm.toLowerCase())) && (categoryFilter === 'all' || expense.category === categoryFilter)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracking</h1>
          <p className="text-gray-600">Manage and record hotel expenses</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
          <PlusIcon size={16} className="mr-1" />
          Add Expense
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <DollarSignIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        {categories.slice(1, 5).map(category => {
        const categoryExpenses = mockExpenses.filter(expense => expense.category === category);
        const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        return <Card key={category} className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 mr-4">
                  <DollarSignIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {category}
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>;
      })}
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-2">
              <FilterIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Category:</span>
            </div>
            {categories.map(category => <button key={category} onClick={() => setCategoryFilter(category)} className={`px-3 py-1 rounded-md text-sm ${categoryFilter === category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {category === 'all' ? 'All Categories' : category}
              </button>)}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </Card>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map(expense => <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(parseISO(expense.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {expense.description}
                  </div>
                  {expense.notes && <div className="text-xs text-gray-500">{expense.notes}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900 capitalize">
                    {expense.paymentMethod.replace('_', ' ')}
                    {expense.receiptNumber && <span className="text-xs text-gray-500 ml-2">
                        Receipt: {expense.receiptNumber}
                      </span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    View
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>)}
            {filteredExpenses.length === 0 && <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No expenses found matching your search
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>;
};
export default Expenses;