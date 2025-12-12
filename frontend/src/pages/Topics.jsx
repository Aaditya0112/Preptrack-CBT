import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { COACHINGMATERIALS } from '../data/coachingMaterial'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Topics() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const material = COACHINGMATERIALS.find(m => m.id === subjectId)
  if (!material) return (
    <div className="p-6">
      <div className="text-lg">Subject not found</div>
    </div>
  )

  const getProgress = (topicId) => {
    // deterministic pseudo-random progress based on topicId
    let h = 0
    for (let i = 0; i < topicId.length; i++) h = (h << 5) - h + topicId.charCodeAt(i)
    const pct = Math.abs(h) % 70 + 15 // 15..84
    return pct
  }

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
          <h2 className="text-2xl font-semibold">{material.title} Topics</h2>
          <div className="text-sm text-gray-500">{material.subtitle}</div>
        </div>
        <div>
          <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {material.topics.map(topic => (
          <article key={topic.topicId} className="bg-white p-3 rounded shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{topic.title}</div>
                <div className="text-xs text-gray-500 mt-1">{topic.difficulty} • {topic.estMinutes} mins</div>
              </div>
              <div >
                <CircularProgressWithLabel value={getProgress(topic.topicId)} />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">{topic.summary}</div>
            <div className="mt-3 flex items-center justify-between">
              <button
                className="px-2 py-1 bg-blue-500 text-white border rounded text-sm"
                onClick={() => {
                  const examObj = {
                    examId: `${topic.topicId}_exam`,
                    examTitle: `${material.title} - ${topic.title}`,
                    durationInSeconds: (topic.estMinutes || 30) * 60,
                    questions: topic.questions || []
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
