import React, { useState, useEffect } from 'react';
import Title from './Title';


interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  link?: string;
  tags?: string[];
}

export default function StoryMapResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Detour migration to circumvent the Himalayas in the Montagu’s Harrier Circus pygargus',
      description: 'Arjun Kannan, M. B. Prashanth, Abhishek Samrat, Raymond H. G. Klaassen and T. Ganesh',
      category: 'research',
      type: 'Research',
      link: 'https://link.springer.com/article/10.1186/s40462-025-00568-z',
      tags: ['banglore', 'lakes', 'history']
    },
    {
      id: '2',
      title: 'Field Guide to Harriers of the Indian Subcontinent',
      description: 'MB Prashanth, Arjun Kannan, S Tamizhazhagan & T Ganesh',
      category: 'fieldguide',
      type: 'Field Guide ',
      link: 'https://atree-communication.s3.amazonaws.com/documments/Field%20Guide%20to%20Harriers%20of%20the%20Indian%20Subcontinent%20%281%29.pdf',
      tags: ['banglore', 'lakes', 'history']
    },
    {
      id: '3',
      title: 'Stopover by migrant Montagu’s Harriers in the Thar Desert is determined by vegetation greenness and grasshopper abundance but not locust outbreaks',
      description: 'T Ganesh, Arjun Kannan, Prashanth M.B., Abhishek Samrat',
      category: 'research',
      type: 'Research',
      link: 'https://www.sciencedirect.com/science/article/abs/pii/S0140196324001332?via%3Dihub',
      tags: ['banglore', 'lakes', 'history']
    },
    {
      id: '4',
      title: 'How Harriers Migrate',
      description: 'Public domain map dataset with physical and cultural geographic data at multiple scales.',
      category: 'comic',
      type: 'Comic ',
      link: 'https://www.atree.org/wp-content/uploads/2024/01/How%20Harriers%20Migrate.pdf',
      tags: [ 'comic']
    },
    {
      id: '5',
      title: 'Secondary seed dispersal by migrant harriers in India',
      description: 'N. R. Anoop, S. Thalavaipandi, S. Selvakumar, M. B. Prashanth, Arjun Kannan, T. Ganesh.',
      category: 'research',
      type: 'Research',
      link: 'https://nsojournals.onlinelibrary.wiley.com/doi/10.1002/oik.11374',
      tags: ['article', 'news', 'press-coverage']
    },
    
  ];

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'fieldguide', name: 'Field Guides' },
    { id: 'research', name: 'Research' },
    { id: 'comic', name: 'Comics' },

  ];

  // Filtering logic
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const spacing = 'p-5 md:px-20 lg:px-40 md:pt-20   ';

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#e9e0d2] to-blue-50 ">
      <div className={`${spacing}`}>
          <Title mainTitle="Resources"/>
      </div>
    
      <div className="w-6/7 mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search resources, tags, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#087f9b] focus:border-transparent text-sm"
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-centre gap-2 px-4 py-2 rounded-full transition-all text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#97610a] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-4 text-slate-600">
          <span className="font-medium">{filteredResources.length}</span>{' '}
          resource{filteredResources.length !== 1 ? 's' : ''} found
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResources.map(resource => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {resource.title}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-500 rounded">
                      {resource.type}
                    </span>
                  </div>

                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colours"
                    >
                      <img
                        src="/new-tab.png"
                        className="opacity-50 w-5 h-5 hover:opacity-100"
                        alt="External Link"
                      />
                    </a>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredResources.length === 0 && (
          <div className="text-centre py-12">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No resources found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-centre items-centre gap-2 mt-10">

            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === index + 1
                    ? 'bg-[#97610a] text-white'
                    : 'bg-white hover:bg-slate-100'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
