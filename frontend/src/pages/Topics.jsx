import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { COACHINGMATERIALS } from '../data/coachingMaterial'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getTopics } from '../api/index'

export default function Topics() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  // const material = COACHINGMATERIALS.find(m => m.id === subjectId)
  // if (!material) return (
  //   <div className="p-6">
  //     <div className="text-lg">Subject not found</div>
  //   </div>
  // )

  const [topics, setTopics] = useState([])

  useEffect(() => { 
    const fetchTopics = async () => { 
      try {
        const response = await getTopics()

        const filteredTopics = response.data.filter(topic => topic.subject.id === parseInt(subjectId));
        setTopics(filteredTopics);
      } catch (error) {
        console.error("There was an error fetching the topics!", error);
      }
    }

    fetchTopics();
  }, [subjectId])

  function CircularProgressWithLabel({ value }) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={value} size={32} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.primary" fontSize={10}>
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{topics[0]?.subject.subject} </h2>
          <div className="text-sm text-gray-500">{topics.length} Topics</div>
        </div>
        <div>
          <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topics.map(topic => (
          <article key={topic.topicId} className="bg-white p-3 rounded shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{topic.title}</div>
                <div className="text-xs text-gray-500 mt-1">{topic.difficulty} • {topic.estMinutes} mins</div>
              </div>
              <div >
                <CircularProgressWithLabel value={topic.progressPercent} />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">{topic.summary}</div>
            <div className="mt-3 flex items-center justify-between">
              <button
                className="px-2 py-1 bg-blue-500 text-white border rounded text-sm"
                onClick={() => {
                  const examObj = {
                    examId: `${topic.topicId}_exam`,
                    examTitle: `${topic.subject.subject} - ${topic.title}`,
                    durationInSeconds: (topic.estMinutes || 30) * 60,  // TODO: adjust as needed
                    questions: topic.questions || [],
                    assessmentType: 'practice',
                  }
                  navigate(`/preview`, { state: { exam: examObj } })
                }}
              >Start Test</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
