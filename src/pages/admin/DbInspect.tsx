import { useEffect, useState } from 'react';
import { inspectDatabaseSchema } from '@/utils/db-inspect';
import { motion } from 'framer-motion';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';

export default function DatabaseInspector() {
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inspect = async () => {
      setLoading(true);
      try {
        const result = await inspectDatabaseSchema();
        setSchema(result);
        if (result.error) {
          setError('Error fetching schema information. Check console for details.');
        }
      } catch (err) {
        setError('Failed to inspect database schema');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    inspect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-90">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-dark-80"
        >
          Loading schema information...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-90 min-h-screen text-gray-dark-80">
      <motion.h1 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Database Schema Inspection
      </motion.h1>
      
      {error && (
        <motion.div
          className="p-4 bg-red-100 text-red-800 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.section variants={itemVariants}>
          <NeumorphicCard className="p-6" variant="elevated" hover="glow">
            <h2 className="text-xl font-semibold mb-4">Tables</h2>
            {schema?.tables?.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {schema.tables.map((table: any) => (
                  <li key={table.table_name}>{table.table_name}</li>
                ))}
              </ul>
            ) : (
              <p>No tables found in public schema</p>
            )}
          </NeumorphicCard>
        </motion.section>

        <motion.section variants={itemVariants}>
          <NeumorphicCard className="p-6" variant="elevated" hover="glow">
            <h2 className="text-xl font-semibold mb-4">RLS Policies</h2>
            {schema?.policies?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Table</th>
                      <th className="px-4 py-2 text-left">Policy</th>
                      <th className="px-4 py-2 text-left">Command</th>
                      <th className="px-4 py-2 text-left">Using</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.policies.map((policy: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-80/10' : ''}>
                        <td className="px-4 py-2">{policy.table_name}</td>
                        <td className="px-4 py-2">{policy.policy_name}</td>
                        <td className="px-4 py-2">{policy.command}</td>
                        <td className="px-4 py-2">{policy.using_expression}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No RLS policies found</p>
            )}
          </NeumorphicCard>
        </motion.section>

        <motion.section variants={itemVariants}>
          <NeumorphicCard className="p-6" variant="elevated" hover="glow">
            <h2 className="text-xl font-semibold mb-4">Table Columns</h2>
            {schema?.columns?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Table</th>
                      <th className="px-4 py-2 text-left">Column</th>
                      <th className="px-4 py-2 text-left">Data Type</th>
                      <th className="px-4 py-2 text-left">Nullable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.columns.map((column: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-80/10' : ''}>
                        <td className="px-4 py-2">{column.table_name}</td>
                        <td className="px-4 py-2">{column.column_name}</td>
                        <td className="px-4 py-2">{column.data_type}</td>
                        <td className="px-4 py-2">{column.is_nullable ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No column information found</p>
            )}
          </NeumorphicCard>
        </motion.section>
      </motion.div>
    </div>
  );
}
