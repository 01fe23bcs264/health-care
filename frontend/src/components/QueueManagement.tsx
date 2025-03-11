import React, { useEffect, useState } from 'react';
import { useQueueService } from '../services/queueService';

interface QueueInfo {
  queueNumber: number;
  estimatedWaitTime: number;
  status: string;
}

export const QueueManagement: React.FC = () => {
  const [queueInfo, setQueueInfo] = useState<QueueInfo[]>([]);
  const { getQueueStatus, checkIn } = useQueueService();

  useEffect(() => {
    const fetchQueueStatus = async () => {
      const status = await getQueueStatus();
      setQueueInfo(status);
    };

    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRemoteCheckIn = async (appointmentId: string) => {
    try {
      await checkIn(appointmentId);
      // Update queue status
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="queue-management">
      <h2>Current Queue Status</h2>
      <div className="queue-list">
        {queueInfo.map((info, index) => (
          <div key={index} className="queue-item">
            <span>Queue Number: {info.queueNumber}</span>
            <span>Estimated Wait: {info.estimatedWaitTime} minutes</span>
            <span>Status: {info.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 